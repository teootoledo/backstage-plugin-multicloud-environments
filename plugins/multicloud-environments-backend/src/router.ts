import { LoggerService, RootConfigService, DatabaseService, HttpAuthService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { EnvironmentService } from './service/EnvironmentService';
import { EnvironmentCollector } from './service/EnvironmentCollector';
import { createProvider } from './providers';
import { OwnershipProcessor } from './processors/OwnershipProcessor';
import { ObservabilityProcessor } from './processors/ObservabilityProcessor';
import { CloudProvider } from './providers/types';

import path from 'path';

export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
  database: DatabaseService;
  httpAuth: HttpAuthService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, database, httpAuth } = options;

  const dbClient = await database.getClient();

  const migrationsDir = path.resolve(__dirname, '../migrations');
  await dbClient.migrate.latest({
    directory: migrationsDir,
  });

  const providers: CloudProvider[] = [];

  if (config.has('multicloud.providers')) {
    const providersConfig = config.getConfig('multicloud.providers');
    for (const key of providersConfig.keys()) {
      const providerConfig = providersConfig.getConfig(key);
      const provider = createProvider(providerConfig, key);
      providers.push(provider);
      logger.info(`Loaded provider: ${provider.getProviderId()}`);
    }
  }
  logger.info(`Multicloud Environments initialized with ${providers.length} providers.`);

  const processors = [
    new OwnershipProcessor(config),
    new ObservabilityProcessor(config),
  ];

  // LoggerService is compatible with winston Logger in Backstage.
  const collector = new EnvironmentCollector(providers, processors, dbClient, logger as any, config);
  const service = new EnvironmentService(dbClient);

  // Schedule refresh
  const frequency = config.getOptionalNumber('multicloud.schedule.frequency.minutes') || 10;
  setInterval(() => {
    collector.refresh().catch(err => logger.error('Failed to refresh environments', err));
  }, frequency * 60 * 1000);

  // Initial refresh
  collector.refresh().catch(err => logger.error('Failed to initial refresh environments', err));

  const router = Router();
  router.use(express.json());

  router.get('/environments', async (req, res) => {
    await httpAuth.credentials(req, {
      allow: ['user', 'service'],
    });
    const envs = await service.getEnvironments();
    res.json(envs);
  });

  router.post('/sync', async (req, res) => {
    await httpAuth.credentials(req, {
      allow: ['user', 'service'],
    });

    try {
      await collector.refresh();
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      logger.error('Failed to manual refresh environments', error);
      res.status(500).json({ error: 'Failed to refresh environments' });
    }
  });

  router.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  return router;
}
