# Configuration Guide

This guide explains how to configure the Multicloud Environments plugin in your `app-config.yaml`.

## Overview

The plugin supports multiple providers:
- **AWS**: Amazon Web Services (EC2)
- **OCI**: Oracle Cloud Infrastructure
- **Bare Metal**: Physical servers
- **Mock**: Fake data for testing/development

## Basic Configuration

Add the `multicloudEnvironments` section to your `app-config.yaml`:

```yaml
multicloud:
  providers:
    # Add provider configurations here
```

## Mock Provider (Fake Cloud Service)

The Mock Provider is perfect for testing the plugin locally without needing real cloud credentials or spending money. It serves static, fake data.

To enable it, add this to your `app-config.yaml` (or `app-config.local.yaml`):

```yaml
multicloud:
  providers:
    my-mock:
      type: mock
      delay: 500 # Optional: Simulate network latency in milliseconds
```

## AWS Configuration

To use the AWS provider, you need to configure the region and account ID. Authentication is handled via the standard AWS SDK chain (environment variables, `~/.aws/credentials`, or IAM roles).

```yaml
multicloud:
  providers:
    my-aws:
      type: aws
      accountId: '123456789012'
      region: us-east-1
```

**Required Permissions:**
The AWS credentials used must have permission to `ec2:DescribeInstances`.

## OCI Configuration

To use the Oracle Cloud Infrastructure provider:

```yaml
multicloud:
  providers:
    my-oci:
      type: oci
      compartmentId: 'ocid1.compartment.oc1..example'
      region: us-ashburn-1
```

**Prerequisites:**
- Ensure you have the OCI CLI configured locally (`~/.oci/config`).
- The configured user must have permissions to list instances in the tenancy.

## Bare Metal Configuration

For on-premise or bare metal servers:

```yaml
multicloud:
  providers:
    my-datacenter:
      type: baremetal
      name: 'DataCenter-1'
      instances:
        - id: 'server-1'
          name: 'db-server'
          tags:
            role: 'database'
```
