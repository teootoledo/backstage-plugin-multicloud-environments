import { UnifiedInstance } from '../lib/types';

export interface CloudProvider {
  getProviderId(): string;
  listInstances(): Promise<UnifiedInstance[]>;
}
