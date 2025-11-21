import { CloudProvider } from './types';
import { UnifiedInstance } from '../lib/types';
import { Config } from '@backstage/config';
import * as core from 'oci-core';
import * as common from 'oci-common';

export class OciProvider implements CloudProvider {
  private readonly computeClient: core.ComputeClient;
  private readonly compartmentId: string;
  private readonly region: string;

  constructor (config: Config) {
    this.compartmentId = config.getString('multicloud.providers.oci.compartmentId');
    this.region = config.getString('multicloud.providers.oci.region');

    // Assuming default config file location or environment variables
    const provider = new common.ConfigFileAuthenticationDetailsProvider();
    this.computeClient = new core.ComputeClient({ authenticationDetailsProvider: provider });
    this.computeClient.regionId = this.region;
  }

  getProviderId(): string {
    return `oci-${this.region}`;
  }

  async listInstances(): Promise<UnifiedInstance[]> {
    const request: core.requests.ListInstancesRequest = {
      compartmentId: this.compartmentId,
    };

    const response = await this.computeClient.listInstances(request);
    const instances: UnifiedInstance[] = [];

    response.items.forEach(instance => {
      if (instance.lifecycleState === core.models.Instance.LifecycleState.Terminated) return;

      // Flatten tags for simplicity
      const tags: Record<string, string> = {
        ...(instance.freeformTags || {}),
        // definedTags is complex (namespace.key), simplifying here or ignoring for now if type mismatch
      };

      instances.push({
        id: instance.id,
        provider: 'oci',
        name: instance.displayName || instance.id,
        region: instance.region,
        status: (instance.lifecycleState?.toLowerCase() as any) || 'unknown',
        type: instance.shape || 'unknown',
        tags: tags,
        url: `https://cloud.oracle.com/compute/instances/${instance.id}?region=${this.region}`,
      });
    });

    return instances;
  }
}
