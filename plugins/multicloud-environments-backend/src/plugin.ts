import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

/**
 * multicloudEnvironmentsPlugin backend plugin
 *
 * @public
 */
export const multicloudEnvironmentsPlugin = createBackendPlugin({
  pluginId: 'multicloud-environments',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
      },
      async init({ logger, config, database, httpRouter, httpAuth }) {
        httpRouter.use(
          await createRouter({
            logger,
            config,
            database,
            httpAuth,
          }),
        );
      },
    });
  },
});
