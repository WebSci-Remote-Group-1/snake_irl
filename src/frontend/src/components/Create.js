// Import React, tools and helpers
import React, { useState, Component, createRef, forwardRef } from 'react';
import Leaflet, { Icon } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  MapConsumer,
} from 'react-leaflet';
import { RollBoxLoading } from 'react-loadingg';

// Import MaterialUI elements
import {
  Box,
  Button,
  Card,
  CardActions,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import AddBoxIcon from '@material-ui/icons/AddBox';

// Import homebrewed files
import '@assets/style/create.scss';
import Header from '@components/shared/Header';
import MapSelect from '@components/shared/MapSelect';
import API from '@root/src/api';
import DefaultMarker from '@assets/img/mapPinDefault.svg';

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const StartCreateNewMap = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const clickOpen = () => {
    setOpen(true);
  };

  const clickClose = () => {
    setOpen(false);
  };

  const clickCloseAndStart = () => {
    setOpen(false);
    var newMapObj = {
      title: title,
      description: description,
      pointsOfInterest: [],
    };

    let oldState = ref.current.state.mapData.slice();
    oldState.push(newMapObj);
    ref.current.setState({ mapData: oldState });
  };

  const handleInputUpdate = (e) => {
    switch (e.target.id) {
      case 'title':
        setTitle(e.target.value);
        break;
      case 'description':
        setDescription(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Button color="primary" variant="contained" onClick={clickOpen}>
        Create a map
      </Button>
      <Dialog
        open={open}
        onClose={clickClose}
        aria-labelledby="create-map-dialog"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create a new map</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of your new map to get started
          </DialogContentText>
          <form noValidate autoComplete="off">
            <Box my={2}>
              <TextField
                autoFocus
                id="title"
                label="title"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputUpdate}
              />
            </Box>
            <Box mb={2}>
              <TextField
                id="description"
                label="description"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputUpdate}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={clickCloseAndStart} color="primary">
            Save
          </Button>
          <Button onClick={clickClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

class MapViewCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapID: props.mapID,
      mapObj: null,
      loading: true,
      mapCenter: [42.72983440371727, -73.68997137045602],
    };
  }

  async componentDidMount() {
    let mapData = await API.get(`/api/v1/maps/${this.state.mapID}`);
    mapData = mapData.data;
    this.setState({ loading: false, mapObj: mapData });
    let mapCenter = [0, 0];
    this.state.mapObj.pointsOfInterest.map((point) => {
      mapCenter[0] += point.lat;
      mapCenter[1] += point.long;

      return null;
    });
    mapCenter[0] /= this.state.mapObj.pointsOfInterest.length;
    mapCenter[1] /= this.state.mapObj.pointsOfInterest.length;

    this.setState({ mapCenter: mapCenter });
  }

  render() {
    return (
      <>
        <Box width="50%" minWidth="200px" height="100%" minHeight="200px">
          {this.state.loading ? (
            <RollBoxLoading speed={250} color="#acacac" />
          ) : (
            <MapContainer center={this.state.mapCenter} zoom={16}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
              <MapConsumer>
                {(map) => {
                  map.flyTo({
                    lat: this.state.mapCenter[0],
                    lng: this.state.mapCenter[1],
                  });
                  return null;
                }}
              </MapConsumer>
              {this.state.mapObj.pointsOfInterest.map((poi) => {
                return (
                  <Marker
                    key={poi.name}
                    position={[poi.lat, poi.long]}
                    icon={
                      new Icon({
                        iconUrl: DefaultMarker,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  >
                    <Popup>{poi.name}</Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </Box>
      </>
    );
  }
}

class MapEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      map: null,
      addPointOpen: false,
      addPointName: '',
      addPointLat: '',
      addPointLong: '',
      addPointError: '',
    };
  }

  handleClose = () => this.setState({ open: false });

  handleAddPointOpen = () => this.setState({ addPointOpen: true });
  handleAddPointClose = () => this.setState({ addPointOpen: false });

  handleAddPointSave = () => {
    switch (true) {
      case this.state.addPointName === '':
        this.setState({ addPointError: 'name' });
        break;
      case this.state.addPointLat === '':
        this.setState({ addPointError: 'lat' });
        break;
      case this.state.addPointLong === '':
        this.setState({ addPointError: 'long' });
        break;
      default:
        let oldState = this.state.map;
        oldState.pointsOfInterest.push({
          name: this.state.addPointName,
          lat: this.state.addPointLat,
          long: this.state.addPointLong,
        });
        this.setState({ map: oldState });
        this.handleAddPointClose();
        break;
    }
  };

  handleAddPointInputChange = (e) => {
    switch (e.target.id) {
      case 'name':
        this.setState({ addPointName: e.target.value });
        break;
      case 'lat':
        this.setState({ addPointLat: e.target.value });
        break;
      case 'long':
        this.setState({ addPointLong: e.target.value });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <>
        <Dialog fullScreen open={this.state.open} onClose={this.handleClose}>
          <Box mx={4}>
            <Grid container justify="space-between" alignItems="flex-start">
              {this.state.map ? (
                <Box mt={3}>
                  <Typography variant="h3">{this.state.map.title}</Typography>
                  <Typography>{this.state.map.description}</Typography>
                </Box>
              ) : null}
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Box mt={10}>
              <Grid container justify="space-evenly">
                <Grid item>
                  {this.state.map ? (
                    <MapViewCard mapID={this.state.map._id} />
                  ) : null}
                </Grid>
                <Grid item>
                  <TableContainer
                    component={Card}
                    raised
                    style={{ minWidth: '35vw', maxWidth: '45vw' }}
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
                        {this.state.map
                          ? this.state.map.pointsOfInterest.map((point) => (
                              <TableRow key={point.name}>
                                <TableCell component="th" scope="row">
                                  {point.name}
                                </TableCell>
                                <TableCell align="right">{point.lat}</TableCell>
                                <TableCell align="right">
                                  {point.long}
                                </TableCell>
                              </TableRow>
                            ))
                          : null}
                      </TableBody>
                    </Table>
                    <CardActions>
                      <IconButton
                        edge="start"
                        color="primary"
                        aria-label="Add new point of interest"
                        onClick={this.handleAddPointOpen}
                      >
                        <AddBoxIcon />
                      </IconButton>
                    </CardActions>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Dialog>
        <Dialog
          open={this.state.addPointOpen}
          onClose={this.handleAddPointClose}
        >
          <DialogTitle>Add new point</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography>
                Please enter the details of your new point
              </Typography>
            </DialogContentText>
            <Box my={2}>
              <TextField
                autoFocus
                id="name"
                label="name"
                type="text"
                fullWidth
                variant="outlined"
                onChange={this.handleAddPointInputChange}
                error={this.state.addPointError === 'name'}
              />
            </Box>
            <Box mb={2}>
              <TextField
                id="lat"
                label="lat"
                type="text"
                fullWidth
                variant="outlined"
                onChange={this.handleAddPointInputChange}
                error={this.state.addPointError === 'lat'}
              />
            </Box>
            <Box mb={2}>
              <TextField
                id="long"
                label="long"
                type="text"
                fullWidth
                variant="outlined"
                onChange={this.handleAddPointInputChange}
                error={this.state.addPointError === 'long'}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAddPointSave} color="primary">
              Save
            </Button>
            <Button onClick={this.handleAddPointClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

class Create extends Component {
  constructor() {
    super();
    this.mapSelect = createRef();
    this.mapEditor = createRef();
    this.state = {
      clickedMap: null,
    };
    this.cardClickHandler = this.cardClickHandler.bind(this);
  }

  // MapSelect click handler
  cardClickHandler(clickedMap) {
    this.setState({
      clickedMap: clickedMap,
    });
    this.mapEditor.current.setState({ open: true, map: clickedMap });
  }

  render() {
    return (
      <>
        <Header />
        <Container>
          <Box my={2}>
            <Grid container justify="space-between">
              <Typography variant="h4">
                Create a new map or edit one of your existing maps
              </Typography>
              <StartCreateNewMap
                mapSelectRef={this.mapSelect}
                ref={this.mapSelect}
              />
            </Grid>
          </Box>
          <MapSelect
            ref={this.mapSelect}
            clickHandler={this.cardClickHandler}
            actionItems
          />
        </Container>
        <MapEditor ref={this.mapEditor} />
      </>
    );
  }

  // render() {
  //   return (
  //     <>
  //       <MapViewCard mapID="6074d236155b07b430f47acf" />
  //     </>
  //   );
  // }
}

export default Create;
