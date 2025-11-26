# Backstage Multicloud Environments Plugin

[![Tests](https://github.com/teootoledo/backstage-plugin-multicloud-environments/actions/workflows/ci.yml/badge.svg)](https://github.com/teootoledo/backstage-plugin-multicloud-environments/actions/workflows/ci.yml)

This plugin provides a unified view of your multicloud environments (AWS, OCI, On-Premise) within Backstage.

## Features

- **Unified Dashboard**: View all your environments in one place.
- **Multicloud Support**: AWS, Oracle Cloud Infrastructure (OCI), and Bare Metal support.
- **Resource Tracking**: Track EC2 instances, OCI instances, and physical servers.
- **Ownership & Observability**: Link environments to owners and observability dashboards.

## Documentation

- [**Installation Guide**](./docs/INSTALLATION.md): How to install the plugin in your Backstage app.
- [**Configuration Guide**](./docs/CONFIGURATION.md): How to configure providers (AWS, OCI, Mock).
- [**Development Guide**](./docs/DEVELOPMENT.md): Architecture, local development, and testing.
- [**Publishing Guide**](./docs/PUBLISHING.md): How to release new versions.

## Quick Start

### 1. Install the packages

In your Backstage root directory:

```bash
# Install backend plugin
yarn workspace backend add @teootoledo/backstage-plugin-multicloud-environments-backend

# Install frontend plugin
yarn workspace app add @teootoledo/backstage-plugin-multicloud-environments
```

### 2. Configure the Backend

In `packages/backend/src/index.ts`:

```typescript
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins
backend.add(import('@teootoledo/backstage-plugin-multicloud-environments-backend'));

backend.start();
```

### 3. Configure the Frontend

In `packages/app/src/App.tsx`:

```typescript
import { MulticloudEnvironmentsPage } from '@teootoledo/backstage-plugin-multicloud-environments';

// ... inside your App routes
<Route path="/multicloud-environments" element={<MulticloudEnvironmentsPage />} />
```

Add a link to your Sidebar in `packages/app/src/components/Root/Root.tsx`:

```typescript
import CloudIcon from '@material-ui/icons/Cloud';

// ... inside Sidebar
<SidebarItem icon={CloudIcon} to="multicloud-environments" text="Environments" />
```

## Configuration

Add the following to your `app-config.yaml`:

```yaml
multicloud:
  providers:
    aws-provider:
      type: aws
      accountId: '123456789012'
      region: us-east-1
    oci-provider:
      type: oci
      compartmentId: 'ocid1.compartment.oc1..example'
      region: us-ashburn-1
    on-premise:
      type: baremetal
      name: 'DataCenter-1'
      instances:
        - id: 'server-1'
          name: 'db-server'
          tags:
            role: 'database'

## Development & Mock Mode

To use the Mock Provider for development or testing without real cloud credentials, configure it in your `app-config.yaml` (or `app-config.local.yaml`):

```yaml
multicloud:
  providers:
    mock-provider:
      type: mock
      delay: 500 # Simulate network latency in ms
```

When `mock.enabled` is set to `true`, the backend will ignore other providers and serve static mock data.
