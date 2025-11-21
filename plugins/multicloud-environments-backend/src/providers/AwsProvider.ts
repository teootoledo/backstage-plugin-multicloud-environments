import { CloudProvider } from './types';
import { UnifiedInstance } from '../lib/types';
import { EC2Client, DescribeInstancesCommand } from '@aws-sdk/client-ec2';
import { Config } from '@backstage/config';

export class AwsProvider implements CloudProvider {
  private readonly client: EC2Client;
  private readonly accountId: string;
  private readonly region: string;

  constructor (config: Config) {
    this.accountId = config.getString('multicloud.providers.aws.accountId');
    this.region = config.getString('multicloud.providers.aws.region');
    this.client = new EC2Client({ region: this.region });
  }

  getProviderId(): string {
    return `aws-${this.accountId}-${this.region}`;
  }

  async listInstances(): Promise<UnifiedInstance[]> {
    const command = new DescribeInstancesCommand({});
    const response = await this.client.send(command);

    const instances: UnifiedInstance[] = [];

    response.Reservations?.forEach(reservation => {
      reservation.Instances?.forEach(instance => {
        if (!instance.InstanceId) return;

        const nameTag = instance.Tags?.find(t => t.Key === 'Name')?.Value || instance.InstanceId;
        const tags: Record<string, string> = {};
        instance.Tags?.forEach(t => {
          if (t.Key && t.Value) tags[t.Key] = t.Value;
        });

        instances.push({
          id: instance.InstanceId,
          provider: 'aws',
          accountId: this.accountId,
          name: nameTag,
          region: this.region,
          status: (instance.State?.Name as any) || 'unknown',
          type: instance.InstanceType || 'unknown',
          privateIp: instance.PrivateIpAddress,
          publicIp: instance.PublicIpAddress,
          tags,
          url: `https://${this.region}.console.aws.amazon.com/ec2/v2/home?region=${this.region}#InstanceDetails:instanceId=${instance.InstanceId}`,
        });
      });
    });

    return instances;
  }
}
