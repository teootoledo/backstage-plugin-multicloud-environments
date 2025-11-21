import { UnifiedInstance } from '@teootoledo/backstage-plugin-multicloud-environments-common';

export interface InstanceProcessor {
  process(instances: UnifiedInstance[]): Promise<UnifiedInstance[]>;
}
