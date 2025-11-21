
import { Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { multicloudEnvironmentsApiRef } from '../api';
import { LogicalEnvironment } from '@teootoledo/backstage-plugin-multicloud-environments-common';
import useAsync from 'react-use/lib/useAsync';
import Alert from '@material-ui/lab/Alert';

export const EnvTable = () => {
  const api = useApi(multicloudEnvironmentsApiRef);
  const { value, loading, error } = useAsync(async () => {
    return await api.getEnvironments();
  }, []);

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const columns: TableColumn<LogicalEnvironment>[] = [
    { title: 'Name', field: 'name' },
    { title: 'Grouping Tag', field: 'groupingTag' },
    { title: 'Total Instances', field: 'stats.total', type: 'numeric' },
    { title: 'Running', field: 'stats.running', type: 'numeric' },
    { title: 'Owners', field: 'owners', render: (row: LogicalEnvironment) => row.owners.join(', ') },
    { title: 'Last Updated', field: 'lastUpdated' },
  ];

  return (
    <Table
      title="Multicloud Environments"
      options={{ search: true, paging: true }}
      columns={columns}
      data={value || []}
      isLoading={loading}
    />
  );
};
