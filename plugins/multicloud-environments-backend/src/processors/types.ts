import { UnifiedInstance } from '../lib/types';

export interface InstanceProcessor {
  process(instances: UnifiedInstance[]): Promise<UnifiedInstance[]>;
}
