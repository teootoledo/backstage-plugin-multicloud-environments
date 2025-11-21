
import { Header, Page, Content, ContentHeader, HeaderLabel, SupportButton } from '@backstage/core-components';
import { EnvTable } from './EnvTable';

export const MulticloudEnvironmentsPage = () => (
  <Page themeId="tool">
    <Header title="Multicloud Environments" subtitle="Aggregated view of cloud environments">
      <HeaderLabel label="Owner" value="Platform Engineering" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Environments">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <EnvTable />
    </Content>
  </Page>
);
