import React, { Component } from 'react';

// Import material UI components
import {
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';

// Import material UI icons
import DeleteIcon from '@material-ui/icons/Delete';

// Import frontend demo placeholder files
import Maps from '@assets/frontend-placeholders/created_maps.json';

// Invidual card for each map
// Takes in the map OBJ it is displaying as well as optionally a designated
// click handler in props
const MapCard = (props) => {
  // Function which runs the defined click handler if provided
  const delegateClick = () =>
    'clickHandler' in props ? props.clickHandler(props.map) : null;

  return (
    <Card raised>
      <CardActionArea id={props.map.title} onClick={delegateClick}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {props.map.title}
          </Typography>
          <Typography>{props.map.description}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton aria-label="delete map">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

// Grid of all map cards displayed
// Takes a clickHandler as an optional prop. When provided this clickHandler is
// passed to each MapCard to handle if a card is clicked.
class MapSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: Maps['maps'], // Hard loaded maps for frontend presentation
    };
  }

  render() {
    return (
      <Grid container justify="center" alignItems="center" spacing={5}>
        {this.state.mapData.map((map) => (
          <Grid item key={map.title}>
            <MapCard map={map} clickHandler={this.props.clickHandler} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default MapSelect;
