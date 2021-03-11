import React, { Component } from 'react';
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

class MapSelect extends Component {
  constructor() {
    super();
    this.state = {
      mapData: Maps['maps'],
    };
  }

  render() {
    return (
      <Grid container justify="center" alignItems="center" spacing={5}>
        {this.state.mapData.map((map) => (
          <Grid item key={map.title}>
            <MapCard title={map.title} description={map.description} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default MapSelect;
