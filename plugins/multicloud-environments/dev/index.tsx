import { createDevApp } from '@backstage/dev-utils';
import { multicloudEnvironmentsPlugin, MulticloudEnvironmentsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(multicloudEnvironmentsPlugin)
  .addPage({
    element: <MulticloudEnvironmentsPage />,
    title: 'Root Page',
    path: '/multicloud-environments',
  })
  .render();
