import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { multicloudEnvironmentsPlugin } from './plugin';
import request from 'supertest';

describe('plugin', () => {
  it('should start', async () => {
    const { server } = await startTestBackend({
      features: [
        multicloudEnvironmentsPlugin,
        mockServices.rootConfig.factory(),
        mockServices.database.factory(),
        mockServices.httpRouter.factory(),
      ],
    });

    await request(server).get('/api/multicloud-environments/health').expect(200, { status: 'ok' });
  });
});
