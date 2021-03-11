// Import material UI components
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Import frontend demo placeholder files
import Maps from '@assets/frontend-placeholders/created_maps.json';

const MapCard = (props) => (
  <Card>
    <CardContent>
      <Typography variant="h5" gutterBottom>
        {props.title}
      </Typography>
      <Typography>{props.description}</Typography>
    </CardContent>
  </Card>
);

export default function MapSelect() {
  return (
    <Grid container justify="center" alignItems="center" spacing={5}>
      {Maps['maps'].map((map) => (
        <Grid item>
          <MapCard title={map.title} description={map.description} />
        </Grid>
      ))}
    </Grid>
  );
}
