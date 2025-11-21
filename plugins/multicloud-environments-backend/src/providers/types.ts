import { UnifiedInstance } from '@teootoledo/backstage-plugin-multicloud-environments-common';

export interface CloudProvider {
  getProviderId(): string;
  listInstances(): Promise<UnifiedInstance[]>;
}
