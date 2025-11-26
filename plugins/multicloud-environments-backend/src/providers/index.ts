import { Config } from '@backstage/config';
import { CloudProvider } from './types';
import { AwsProvider } from './AwsProvider';
import { OciProvider } from './OciProvider';
import { BareMetalProvider } from './BareMetalProvider';
import { MockProvider } from './MockProvider';

export function createProvider(config: Config, providerId?: string): CloudProvider {
  const type = config.getString('type');
  const id = config.getOptionalString('id') || providerId || type;

  switch (type) {
    case 'aws':
      return new AwsProvider(config);
    case 'oci':
      return new OciProvider(config);
    case 'baremetal':
      return new BareMetalProvider(config);
    case 'mock':
      return new MockProvider(id, config.getOptionalNumber('delay'));
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
