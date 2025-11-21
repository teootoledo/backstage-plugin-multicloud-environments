import { InstanceProcessor } from './types';
import { UnifiedInstance } from '@teootoledo/backstage-plugin-multicloud-environments-common';
import { Config } from '@backstage/config';

export class OwnershipProcessor implements InstanceProcessor {
  private keys: string[];

  constructor (config: Config) {
    this.keys = config.getOptionalStringArray('multicloud.ownershipKeys') || ['owner', 'team'];
  }

  async process(instances: UnifiedInstance[]): Promise<UnifiedInstance[]> {
    return instances.map(inst => {
      const ownerKey = this.keys.find(k => inst.tags[k]);
      return {
        ...inst,
        owner: ownerKey ? inst.tags[ownerKey] : undefined
      };
    });
  }
}
