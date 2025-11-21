import { MockProvider } from './MockProvider';

describe('MockProvider', () => {
  it('should return mock instances', async () => {
    const provider = new MockProvider('test-mock', 10);
    const instances = await provider.listInstances();

    expect(instances.length).toBeGreaterThan(0);
    expect(instances[0].provider).toBe('aws');
    expect(instances[0].id).toBeDefined();
  });

  it('should respect latency', async () => {
    const start = Date.now();
    const latency = 100;
    const provider = new MockProvider('test-latency', latency);
    await provider.listInstances();
    const duration = Date.now() - start;

    expect(duration).toBeGreaterThanOrEqual(latency - 20); // Allow some buffer
  });
});
