
import { Card, CardContent, Typography, Grid, Chip } from '@material-ui/core';
import { LogicalEnvironment } from '@teootoledo/backstage-plugin-multicloud-environments-common';

export const EnvCard = ({ env }: { env: LogicalEnvironment }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {env.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {env.groupingTag}
        </Typography>
        <Grid container spacing={1}>
          <Grid item>
            <Chip label={`Total: ${env.stats.total}`} />
          </Grid>
          <Grid item>
            <Chip label={`Running: ${env.stats.running}`} color="primary" />
          </Grid>
        </Grid>
        <Typography variant="body2" component="p" style={{ marginTop: 10 }}>
          Owners: {env.owners.join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};
