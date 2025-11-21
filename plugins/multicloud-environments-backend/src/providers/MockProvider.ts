import { CloudProvider } from './types';
import { UnifiedInstance } from '../lib/types';

export class MockProvider implements CloudProvider {
  private readonly id: string;
  private readonly latency: number;

  constructor (id: string = 'mock-1', latency: number = 500) {
    this.id = id;
    this.latency = latency;
  }

  getProviderId(): string {
    return `mock-${this.id}`;
  }

  async listInstances(): Promise<UnifiedInstance[]> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, this.latency));

    return [
      {
        id: 'i-mock-1',
        provider: 'aws',
        name: 'mock-prod-web',
        region: 'us-east-1',
        status: 'running',
        type: 't3.micro',
        tags: { env: 'prod', 'app-id': 'web-app', owner: 'team-a' },
        url: 'http://localhost/mock/aws',
      },
      {
        id: 'i-mock-2',
        provider: 'oci',
        name: 'mock-db-primary',
        region: 'us-ashburn-1',
        status: 'stopped',
        type: 'VM.Standard2.1',
        tags: { env: 'prod', 'app-id': 'db-service', owner: 'team-b' },
        url: 'http://localhost/mock/oci',
      },
      {
        id: 'i-mock-fail',
        provider: 'azure',
        name: 'mock-analytics',
        region: 'westeurope',
        status: 'terminated',
        type: 'Standard_B1s',
        tags: { env: 'dev' }, // Missing owner to test edge cases
        url: 'http://localhost/mock/azure',
      }
    ];
  }
}
