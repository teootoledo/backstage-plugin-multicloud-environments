
import React, { useState } from 'react';
import { Header, Page, Content, ContentHeader, HeaderLabel, SupportButton } from '@backstage/core-components';
import { EnvTable } from './EnvTable';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import { multicloudEnvironmentsApiRef } from '../api';
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';

export const MulticloudEnvironmentsPage = () => {
  const api = useApi(multicloudEnvironmentsApiRef);
  const alertApi = useApi(alertApiRef);
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      await api.refreshEnvironments();
      alertApi.post({ message: 'Environments synced successfully', severity: 'success' });
    } catch (e) {
      alertApi.post({ message: 'Failed to sync environments', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page themeId="tool">
      <Header title="Multicloud Environments" subtitle="Aggregated view of cloud environments">
        <HeaderLabel label="Owner" value="Platform Engineering" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Environments">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SyncIcon />}
            onClick={handleSync}
            disabled={loading}
            style={{ marginRight: 16 }}
          >
            {loading ? 'Syncing...' : 'Sync'}
          </Button>
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <EnvTable />
      </Content>
    </Page>
  );
};
