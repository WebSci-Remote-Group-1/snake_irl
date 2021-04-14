// Import React, tools and helpers
import React, { Component } from 'react';

// Import MaterialUI elements
import {
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// Import common components
import '@assets/style/create.scss';
import Header from '@components/shared/Header';
import MapSelect from '@components/shared/MapSelect';

// Import frontend demo placeholder files
import Maps from '@assets/frontend-placeholders/created_maps.json';

class MapPreview extends Component {
  render() {
    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.props.handleClose}
      >
        <Grid
          container
          justify="space-between"
          alignItems="flex-start"
          style={{ flexDirection: 'row-reverse' }}
        >
          <IconButton
            margin-left="auto"
            // edge="start"
            color="inherit"
            onClick={this.props.handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          {this.props.map ? (
            <Box
              mt={3}
              style={{ maxWidth: '85%', margin: '10px auto 10px 20px' }}
            >
              <Typography variant="h3">{this.props.map.title}</Typography>
              <Typography>{this.props.map.description}</Typography>
            </Box>
          ) : null}
        </Grid>
        <img
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.androidbeat.com%2Fwp-content%2Fuploads%2F2014%2F11%2Fgoogle_maps_api.png&f=1&nofb=1"
          id="map_ph"
          alt="map placeholder"
          style={{ maxWidth: '90%', margin: '0 auto' }}
        />
        {/* Placeholder */}
        {this.props.map ? (
          <TableContainer
            component={Card}
            raised
            style={{
              maxWidth: '90%',
              margin: '10px auto',
              maxHeight: '40vh',
              overflow: 'scroll',
            }}
          >
            <Table aria-label="Points of Interest Table">
              <TableHead>
                <TableRow>
                  <TableCell>Name of Location</TableCell>
                  <TableCell align="right">Lat</TableCell>
                  <TableCell align="right">Long</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.map.pointsOfInterest.map((point) => (
                  <TableRow key={point.name}>
                    <TableCell component="th" scope="row">
                      {point.name}
                    </TableCell>
                    <TableCell align="right">{point.lat}</TableCell>
                    <TableCell align="right">{point.long}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
        <Grid container justify="center" alignItems="flex-start">
          <Button variant="contained" color="primary">
            Start Game!
          </Button>
        </Grid>
      </Dialog>
    );
  }
}

class MissionSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: Maps['maps'], // Hard loaded maps for frontend presentation
      open: false,
      map: null,
    };
    this.clickHandler = this.clickHandler.bind(this);
    // this.handleClose.bind(this);
  }

  clickHandler(clickedMap) {
    this.setState({ map: clickedMap, open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    // console.log(this.state.mapData);
    return (
      <>
        <Header />
        <img
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.androidbeat.com%2Fwp-content%2Fuploads%2F2014%2F11%2Fgoogle_maps_api.png&f=1&nofb=1"
          id="map_ph"
          alt="map placeholder"
          style={{ maxWidth: '100%', margin: '0 auto' }}
        />
        {/* Placeholder */}
        <MapSelect clickHandler={this.clickHandler} />
        <MapPreview
          open={this.state.open}
          map={this.state.map}
          handleClose={() => this.handleClose()}
        />
      </>
    );
  }
}

export default MissionSelect;
