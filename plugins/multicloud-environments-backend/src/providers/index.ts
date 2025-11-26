import { Config } from '@backstage/config';
import { CloudProvider } from './types';
import { AwsProvider } from './AwsProvider';
import { OciProvider } from './OciProvider';
import { BareMetalProvider } from './BareMetalProvider';
import { MockProvider } from './MockProvider';

export function createProvider(config: Config, providerId?: string): CloudProvider {
  // Check if it's a mock provider first (custom type)
  const type = config.getOptionalString('type');

  if (type === 'mock' || providerId === 'mock' || config.has('delay')) {
    const id = config.getOptionalString('id') || providerId || 'mock';
    const delay = config.getOptionalNumber('delay');
    return new MockProvider(id, delay);
  }

  // Fallback to checking keys for standard providers if type isn't explicit
  // or if the config structure implies a specific provider
  if (config.has('accountId')) {
    return new AwsProvider(config);
  }
  if (config.has('compartmentId')) {
    return new OciProvider(config);
  }
  if (config.has('instances')) {
    return new BareMetalProvider(config);
  }

  throw new Error(`Unknown provider configuration: ${JSON.stringify(config.keys())}`);
}
