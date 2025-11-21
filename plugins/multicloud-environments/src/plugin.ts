import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { multicloudEnvironmentsApiRef, MulticloudEnvironmentsApiClient } from './api';

export const multicloudEnvironmentsPlugin = createPlugin({
  id: 'multicloud-environments',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: multicloudEnvironmentsApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new MulticloudEnvironmentsApiClient({ discoveryApi, fetchApi }),
    }),
  ],
});

export const MulticloudEnvironmentsPage = multicloudEnvironmentsPlugin.provide(
  createRoutableExtension({
    name: 'MulticloudEnvironmentsPage',
    component: () =>
      import('./components/MulticloudEnvironmentsPage').then(m => m.MulticloudEnvironmentsPage),
    mountPoint: rootRouteRef,
  }),
);
