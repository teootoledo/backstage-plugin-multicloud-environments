import { InstanceProcessor } from './types';
import { UnifiedInstance } from '@teootoledo/backstage-plugin-multicloud-environments-common';
import { Config } from '@backstage/config';

export class ObservabilityProcessor implements InstanceProcessor {
  private grafanaMap: Record<string, string>;
  private template: string;

  constructor (config: Config) {
    this.grafanaMap = config.getOptionalConfig('multicloud.observability.grafanaMap')?.get() || {};
    this.template = config.getOptionalString('multicloud.observability.queryTemplate') || '';
  }

  async process(instances: UnifiedInstance[]): Promise<UnifiedInstance[]> {
    return instances.map(inst => {
      // Find base URL by region prefix match
      const regionKey = Object.keys(this.grafanaMap).find(key => inst.region.startsWith(key));
      const baseUrl = regionKey ? this.grafanaMap[regionKey] : this.grafanaMap['default'];

      if (!baseUrl) return inst;

      // Simple template replacement
      const finalUrl = `${baseUrl}${this.template}`
        .replace('${instanceId}', inst.id)
        .replace('${privateIp}', inst.privateIp || '');

      return { ...inst, observabilityUrl: finalUrl };
    });
  }
}
