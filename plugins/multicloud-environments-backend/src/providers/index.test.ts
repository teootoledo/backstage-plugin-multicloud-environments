import { ConfigReader } from '@backstage/config';
import { createProvider } from './index';
import { AwsProvider } from './AwsProvider';
import { OciProvider } from './OciProvider';
import { MockProvider } from './MockProvider';
import { BareMetalProvider } from './BareMetalProvider';

jest.mock('oci-common', () => ({
  ConfigFileAuthenticationDetailsProvider: jest.fn(),
}));

jest.mock('oci-core', () => ({
  ComputeClient: jest.fn(),
}));

describe('createProvider', () => {
  it('should create an AwsProvider', () => {
    const config = new ConfigReader({
      type: 'aws',
      accountId: '123',
      region: 'us-east-1',
    });
    const provider = createProvider(config);
    expect(provider).toBeInstanceOf(AwsProvider);
  });

  it('should create an OciProvider', () => {
    const config = new ConfigReader({
      type: 'oci',
      compartmentId: 'ocid1...',
      region: 'us-ashburn-1',
    });
    const provider = createProvider(config);
    expect(provider).toBeInstanceOf(OciProvider);
  });

  it('should create a MockProvider', () => {
    const config = new ConfigReader({
      type: 'mock',
      delay: 100,
    });
    const provider = createProvider(config);
    expect(provider).toBeInstanceOf(MockProvider);
  });

  it('should create a BareMetalProvider', () => {
    const config = new ConfigReader({
      type: 'baremetal',
      name: 'dc1',
      instances: [],
    });
    const provider = createProvider(config);
    expect(provider).toBeInstanceOf(BareMetalProvider);
  });

  it('should throw error for unknown type', () => {
    const config = new ConfigReader({
      type: 'unknown',
    });
    expect(() => createProvider(config)).toThrow('Unknown provider type: unknown');
  });
});
