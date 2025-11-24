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
multicloudEnvironments:
  providers:
    # Add provider configurations here
```

## Mock Provider (Fake Cloud Service)

The Mock Provider is perfect for testing the plugin locally without needing real cloud credentials or spending money. It serves static, fake data.

To enable it, add this to your `app-config.yaml` (or `app-config.local.yaml`):

```yaml
multicloudEnvironments:
  providers:
    mock:
      enabled: true
      delay: 500 # Optional: Simulate network latency in milliseconds
```

**Note:** When `mock.enabled` is `true`, the backend will ignore all other configured providers and only return mock data.

## AWS Configuration

To use the AWS provider, you need to configure the region. Authentication is handled via the standard AWS SDK chain (environment variables, `~/.aws/credentials`, or IAM roles).

```yaml
multicloudEnvironments:
  providers:
    aws:
      region: us-east-1
```

**Required Permissions:**
The AWS credentials used must have permission to `ec2:DescribeInstances`.

## OCI Configuration

To use the Oracle Cloud Infrastructure provider:

```yaml
multicloudEnvironments:
  providers:
    oci:
      configProfile: DEFAULT # The profile name in your ~/.oci/config
```

**Prerequisites:**
- Ensure you have the OCI CLI configured locally (`~/.oci/config`).
- The configured user must have permissions to list instances in the tenancy.

## Bare Metal Configuration

For on-premise or bare metal servers:

```yaml
multicloudEnvironments:
  providers:
    bareMetal:
      # Configuration depends on your specific bare metal implementation
      # (This is a placeholder for future extension)
```
