import { createApiRef, DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { LogicalEnvironment } from './types';

export const multicloudEnvironmentsApiRef = createApiRef<MulticloudEnvironmentsApi>({
  id: 'plugin.multicloud-environments.service',
});

export interface MulticloudEnvironmentsApi {
  getEnvironments(): Promise<LogicalEnvironment[]>;
}

export class MulticloudEnvironmentsApiClient implements MulticloudEnvironmentsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor (options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getEnvironments(): Promise<LogicalEnvironment[]> {
    const url = await this.discoveryApi.getBaseUrl('multicloud-environments');
    const response = await this.fetchApi.fetch(`${url}/environments`);

    if (!response.ok) {
      throw new Error(`Error fetching environments: ${response.statusText}`);
    }

    return await response.json();
  }
}
