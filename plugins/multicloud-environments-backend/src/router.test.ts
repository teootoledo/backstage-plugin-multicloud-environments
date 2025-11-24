import { mockServices, TestDatabases } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import path from 'path';

describe('createRouter', () => {
  let app: express.Express;
  const databases = TestDatabases.create({
    ids: ['SQLITE_3'],
  });

  beforeAll(async () => {
    const knex = await databases.init('SQLITE_3');

    const router = await createRouter({
      logger: mockServices.logger.mock(),
      config: mockServices.rootConfig({
        data: {
          multicloud: {
            providers: {
              mock: {
                type: 'mock',
              },
            },
          },
        },
      }),
      database: {
        getClient: async () => knex,
      } as any,
      httpAuth: mockServices.httpAuth.mock(),
    });
    app = express().use(router);

    // Allow initial refresh to complete (MockProvider has 500ms latency)
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /environments', () => {
    it('returns mock environments grouped by tag', async () => {
      const response = await request(app).get('/environments');

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true);
      // MockProvider returns 3 instances: 2 prod, 1 dev.
      // Service groups them into 2 environments.
      expect(response.body).toHaveLength(2);

      const prodEnv = response.body.find((e: any) => e.name === 'prod');
      expect(prodEnv).toBeDefined();
      expect(prodEnv.instances).toHaveLength(2);
      expect(prodEnv.instances).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'i-mock-1', name: 'mock-prod-web' }),
          expect.objectContaining({ id: 'i-mock-2', name: 'mock-db-primary' }),
        ])
      );

      const devEnv = response.body.find((e: any) => e.name === 'dev');
      expect(devEnv).toBeDefined();
      expect(devEnv.instances).toHaveLength(1);
      expect(devEnv.instances[0]).toMatchObject({
        id: 'i-mock-fail',
        name: 'mock-analytics',
      });
    });
  });
});
