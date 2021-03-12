// Import React, tools and helpers
import React, { useState, Component, createRef, forwardRef } from 'react';

// Import MaterialUI elements
import {
  Box,
  Button,
  Card,
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

// Import homebrewed files
import '@assets/style/create.scss';
import Header from '@components/shared/Header';
import MapSelect from '@components/shared/MapSelect';

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

class MapEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      map: null,
    };
  }

  handleClose = () => this.setState({ open: false });

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
                  <img
                    src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.androidbeat.com%2Fwp-content%2Fuploads%2F2014%2F11%2Fgoogle_maps_api.png&f=1&nofb=1"
                    id="map_ph"
                  />
                </Grid>
                <Grid item>
                  <TableContainer component={Card} raised>
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
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </Box>
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
}

export default Create;
