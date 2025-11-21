import { Knex } from 'knex';
import { UnifiedInstance, LogicalEnvironment } from '@teootoledo/backstage-plugin-multicloud-environments-common';

export class EnvironmentService {
  private readonly db: Knex;

  constructor (db: Knex) {
    this.db = db;
  }

  async getEnvironments(): Promise<LogicalEnvironment[]> {
    const rows = await this.db('multicloud_environments').select('*');

    return rows.map(row => {
      const instances: UnifiedInstance[] = typeof row.instances_json === 'string'
        ? JSON.parse(row.instances_json)
        : row.instances_json;

      const running = instances.filter(i => i.status === 'running').length;
      const owners = Array.from(new Set(instances.map(i => i.owner).filter((o): o is string => !!o)));

      return {
        id: row.id,
        name: row.name,
        groupingTag: row.grouping_tag,
        instances: instances,
        owners: owners,
        lastUpdated: row.last_updated,
        stats: {
          total: instances.length,
          running: running,
        },
      };
    });
  }
}
