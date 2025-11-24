# Installation Guide

This guide explains how to install the `@teootoledo/backstage-plugin-multicloud-environments` plugin into your Backstage application.

## Prerequisites

- A running Backstage instance (created with `npx @backstage/create-app`).
- Node.js 20 or later.
- Yarn 1.x.

## 1. Install the Packages

From the root of your Backstage project, install the backend and frontend packages:

```bash
# Install backend plugin
yarn workspace backend add @teootoledo/backstage-plugin-multicloud-environments-backend

# Install frontend plugin
yarn workspace app add @teootoledo/backstage-plugin-multicloud-environments
```

## 2. Configure the Backend

You need to add the plugin to your backend router.

**For the New Backend System (Alpha/Beta):**

In `packages/backend/src/index.ts`:

```typescript
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins
backend.add(import('@teootoledo/backstage-plugin-multicloud-environments-backend'));

backend.start();
```

**For the Legacy Backend System:**

In `packages/backend/src/plugins/multicloud.ts` (create this file):

```typescript
import { createRouter } from '@teootoledo/backstage-plugin-multicloud-environments-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
  });
}
```

Then in `packages/backend/src/index.ts`:

```typescript
import multicloud from './plugins/multicloud';

// ... inside main function
const multicloudEnv = useHotMemoize(module, () => createEnv('multicloud'));
apiRouter.use('/multicloud-environments', await multicloud(multicloudEnv));
```

## 3. Configure the Frontend

Add the plugin page and a sidebar item to your frontend application.

In `packages/app/src/App.tsx`:

```typescript
import { MulticloudEnvironmentsPage } from '@teootoledo/backstage-plugin-multicloud-environments';

// ... inside the <FlatRoutes>
<Route path="/multicloud-environments" element={<MulticloudEnvironmentsPage />} />
```

In `packages/app/src/components/Root/Root.tsx`:

```typescript
import CloudIcon from '@material-ui/icons/Cloud';

// ... inside the <Sidebar>
<SidebarItem icon={CloudIcon} to="multicloud-environments" text="Environments" />
```

## 4. Next Steps

Proceed to [Configuration](./CONFIGURATION.md) to set up your cloud providers or enable the Mock Provider.
