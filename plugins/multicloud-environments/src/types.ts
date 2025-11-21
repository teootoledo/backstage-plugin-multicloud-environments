/**
 * Represents a normalized compute instance from any provider.
 */
export interface UnifiedInstance {
  id: string;
  provider: 'aws' | 'gcp' | 'azure' | 'oci' | 'vmware' | 'baremetal' | string;
  accountId?: string;
  name: string;
  region: string;
  status: 'running' | 'stopped' | 'terminated' | 'unknown';
  type: string;
  privateIp?: string;
  publicIp?: string;
  tags: Record<string, string>;
  url: string;

  // Enriched Fields (Populated by Processors)
  observabilityUrl?: string;
  owner?: string;
}

/**
 * Represents a logical environment.
 */
export interface LogicalEnvironment {
  id: string;
  name: string;
  groupingTag: string;
  instances: UnifiedInstance[];
  owners: string[];
  lastUpdated: string;
  stats: {
    total: number;
    running: number;
  };
}
