import React, { Component } from 'react';
import { RollBoxLoading } from 'react-loadingg';

// Import material UI components
import {
  Box,
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

import API from '@root/src/api';

// Invidual card for each map
// Takes in the map OBJ it is displaying as well as optionally a designated
// click handler in props
const MapCard = (props) => {
  // Function which runs the defined click handler if provided
  const delegateClick = () =>
    'clickHandler' in props ? props.clickHandler(props.map) : null;

  return (
    <Box minWidth={window.innerWidth < 600 ? '90vw' : null}>
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
          {props.actionItems ? (
            <IconButton aria-label="delete map">
              <DeleteIcon />
            </IconButton>
          ) : null}
        </CardActions>
      </Card>
    </Box>
  );
};

// Grid of all map cards displayed
// Takes a clickHandler as an optional prop. When provided this clickHandler is
// passed to each MapCard to handle if a card is clicked.
class MapSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: null,
      loading: true,
    };
  }

  async componentDidMount() {
    let mapData = await API.get('/api/v1/maps');
    if (mapData.status === 200) {
      this.setState({
        mapData: mapData.data,
        loading: false,
      });
    }
  }

  render() {
    return this.state.loading ? (
      <RollBoxLoading color="#acacac" />
    ) : (
      <Grid
        container
        justify="center"
        alignItems="center"
        spacing={window.innerWidth > 600 ? 5 : 1}
      >
        {this.state.mapData.map((map) => (
          <Grid item key={map.title}>
            <MapCard
              map={map}
              clickHandler={this.props.clickHandler}
              actionItems={'actionItems' in this.props ? true : false}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

// export const MapCard;
export default MapSelect;
