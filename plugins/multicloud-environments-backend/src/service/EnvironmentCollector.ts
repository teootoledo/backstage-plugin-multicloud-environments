import { CloudProvider } from '../providers/types';
import { InstanceProcessor } from '../processors/types';
import { LogicalEnvironment } from '@teootoledo/backstage-plugin-multicloud-environments-common';
import { UnifiedInstance } from '@teootoledo/backstage-plugin-multicloud-environments-common';
import { Knex } from 'knex';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

export class EnvironmentCollector {
  private readonly providers: CloudProvider[];
  private readonly processors: InstanceProcessor[];
  private readonly db: Knex;
  private readonly logger: Logger;
  private readonly groupingKeys: string[];

  constructor (
    providers: CloudProvider[],
    processors: InstanceProcessor[],
    db: Knex,
    logger: Logger,
    config: Config
  ) {
    this.providers = providers;
    this.processors = processors;
    this.db = db;
    this.logger = logger;
    this.groupingKeys = config.getOptionalStringArray('multicloud.groupingKeys') || ['env', 'app-id'];
  }

  async refresh() {
    this.logger.info('Starting multicloud environment refresh...');

    // 1. FAULT TOLERANT FETCHING (Promise.allSettled)
    const results = await Promise.allSettled(
      this.providers.map(p => p.listInstances())
    );

    let allInstances: UnifiedInstance[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allInstances.push(...result.value);
      } else {
        const providerId = this.providers[index].getProviderId();
        this.logger.error(`Failed to fetch from provider ${providerId}: ${result.reason}`);
      }
    });

    // 2. PIPELINE PROCESSING (Enrichment)
    for (const processor of this.processors) {
      try {
        allInstances = await processor.process(allInstances);
      } catch (error) {
        this.logger.error(`Processor failed`, error);
      }
    }

    // 3. GROUPING LOGIC
    const environments = this.groupInstances(allInstances);

    // 4. PERSISTENCE
    await this.db.transaction(async tx => {
      await tx('multicloud_environments').delete();
      if (environments.length > 0) {
        await tx('multicloud_environments').insert(environments.map(env => ({
          id: env.id,
          name: env.name,
          grouping_tag: env.groupingTag,
          instances_json: JSON.stringify(env.instances),
          last_updated: new Date(),
        })));
      }
    });

    this.logger.info(`Refresh complete. Stored ${environments.length} environments.`);
  }

  private groupInstances(instances: UnifiedInstance[]): LogicalEnvironment[] {
    const groups: Record<string, UnifiedInstance[]> = {};

    instances.forEach(inst => {
      // Find the first matching grouping key
      const key = this.groupingKeys.find(k => inst.tags[k]);
      const groupName = key ? inst.tags[key] : 'uncategorized';

      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(inst);
    });

    return Object.entries(groups).map(([name, groupInstances]) => {
      const running = groupInstances.filter(i => i.status === 'running').length;
      const owners = Array.from(new Set(groupInstances.map(i => i.owner).filter((o): o is string => !!o)));

      return {
        id: `env-${name}`,
        name: name,
        groupingTag: name,
        instances: groupInstances,
        owners: owners,
        lastUpdated: new Date().toISOString(),
        stats: {
          total: groupInstances.length,
          running: running,
        },
      };
    });
  }
}
