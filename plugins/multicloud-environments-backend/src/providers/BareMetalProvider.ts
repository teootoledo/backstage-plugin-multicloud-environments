import { CloudProvider } from './types';
import { UnifiedInstance } from '../lib/types';
import { Config } from '@backstage/config';

export class BareMetalProvider implements CloudProvider {
  private readonly instances: UnifiedInstance[];
  private readonly providerId: string;

  constructor (config: Config) {
    const name = config.getString('name');
    this.providerId = `baremetal-${name}`;

    const rawInstances = config.getConfigArray('instances');
    this.instances = rawInstances.map(instConfig => {
      // Helper to get tags as Record<string, string>
      const tagsConfig = instConfig.getOptionalConfig('tags');
      const tags: Record<string, string> = tagsConfig ? tagsConfig.get() : {};

      return {
        id: instConfig.getString('id'),
        provider: 'baremetal',
        name: instConfig.getString('name'),
        region: 'on-premise',
        status: 'running', // Assumed running for static config
        type: 'baremetal',
        tags: tags,
        url: '',
      };
    });
  }

  getProviderId(): string {
    return this.providerId;
  }

  async listInstances(): Promise<UnifiedInstance[]> {
    return this.instances;
  }
}
