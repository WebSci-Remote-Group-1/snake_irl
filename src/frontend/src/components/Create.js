// Import React, tools and helpers
import React, { useState, Component, createRef, forwardRef } from 'react';

import 'leaflet/dist/leaflet.css';

// Import MaterialUI elements
import {
  Box,
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
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
import DeleteIcon from '@material-ui/icons/Delete';
import PlaceIcon from '@material-ui/icons/Place';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';


import { RollBoxLoading } from 'react-loadingg';
import { cloneDeep, isEqual } from 'lodash';

// Import homebrewed files
import '@assets/style/create.scss';
import Header from '@components/shared/Header';
import MapSelect from '@components/shared/MapSelect';
import MapDisplay from '@components/shared/MapDisplay';
import PointSelect from '@components/shared/PointSelect';
import api from '../api';



// const StartCreateNewMap = forwardRef((props, ref) => {
//   const [open, setOpen] = useState(false);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const clickOpen = () => {
//     setOpen(true);
//   };

//   const clickClose = () => {
//     setOpen(false);
//   };

//   const clickCloseAndStart = () => {
//     setOpen(false);
//     var newMapObj = {
//       title: title,
//       description: description,
//       pointsOfInterest: [],
//     };

//     let oldState = ref.current.state.mapData.slice();
//     oldState.push(newMapObj);
//     ref.current.setState({ mapData: oldState });
//   };

//   const handleInputUpdate = (e) => {
//     switch (e.target.id) {
//       case 'title':
//         setTitle(e.target.value);
//         break;
//       case 'description':
//         setDescription(e.target.value);
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <>
//       <Button color="primary" variant="contained" onClick={clickOpen}>
//         Create a map
//       </Button>
//       <Dialog
//         open={open}
//         onClose={clickClose}
//         aria-labelledby="create-map-dialog"
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>Create a new map</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please enter the details of your new map to get started
//           </DialogContentText>
//           <form noValidate autoComplete="off">
//             <Box my={2}>
//               <TextField
//                 autoFocus
//                 id="title"
//                 label="title"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 onChange={handleInputUpdate}
//               />
//             </Box>
//             <Box mb={2}>
//               <TextField
//                 id="description"
//                 label="description"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 onChange={handleInputUpdate}
//               />
//             </Box>
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={clickCloseAndStart} color="primary">
//             Save
//           </Button>
//           <Button onClick={clickClose} color="secondary">
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// });

// class MapEditor extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       open: false,
//       map: null,
//       addPointOpen: false,
//       addPointName: '',
//       addPointLat: '',
//       addPointLong: '',
//       addPointError: '',
//     };
//   }

//   handleClose = () => this.setState({ open: false });

//   handleAddPointOpen = () => this.setState({ addPointOpen: true });
//   handleAddPointClose = () => this.setState({ addPointOpen: false });

//   handleAddPointSave = () => {
//     switch (true) {
//       case this.state.addPointName === '':
//         this.setState({ addPointError: 'name' });
//         break;
//       case this.state.addPointLat === '':
//         this.setState({ addPointError: 'lat' });
//         break;
//       case this.state.addPointLong === '':
//         this.setState({ addPointError: 'long' });
//         break;
//       default:
//         let oldState = this.state.map;
//         oldState.pointsOfInterest.push({
//           name: this.state.addPointName,
//           lat: this.state.addPointLat,
//           long: this.state.addPointLong,
//         });
//         this.setState({ map: oldState });
//         this.handleAddPointClose();
//         break;
//     }
//   };

//   handleAddPointInputChange = (e) => {
//     switch (e.target.id) {
//       case 'name':
//         this.setState({ addPointName: e.target.value });
//         break;
//       case 'lat':
//         this.setState({ addPointLat: e.target.value });
//         break;
//       case 'long':
//         this.setState({ addPointLong: e.target.value });
//         break;
//       default:
//         break;
//     }
//   };

//   render() {
//     return (
//       <>
//         <Dialog fullScreen open={this.state.open} onClose={this.handleClose}>
//           <Box mx={4}>
//             <Grid container justify="space-between" alignItems="flex-start">
//               {this.state.map ? (
//                 <Box mt={3}>
//                   <Typography variant="h3">{this.state.map.title}</Typography>
//                   <Typography>{this.state.map.description}</Typography>
//                 </Box>
//               ) : null}
//               <IconButton
//                 edge="start"
//                 color="inherit"
//                 onClick={this.handleClose}
//                 aria-label="close"
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Grid>
//             <Box mt={10}>
//               <Grid container justify="space-evenly">
//                 <Grid item>
//                   {this.state.map ? (
//                     <MapDisplay mapID={this.state.map._id} />
//                   ) : null}
//                 </Grid>
//                 <Grid item>
//                   <TableContainer
//                     component={Card}
//                     raised
//                     style={{ minWidth: '35vw', maxWidth: '45vw' }}
//                   >
//                     <Table aria-label="Points of Interest Table">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>Name of Location</TableCell>
//                           <TableCell align="right">Lat</TableCell>
//                           <TableCell align="right">Long</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {this.state.map
//                           ? this.state.map.pointsOfInterest.map((point) => (
//                               <TableRow key={point.name}>
//                                 <TableCell component="th" scope="row">
//                                   {point.name}
//                                 </TableCell>
//                                 <TableCell align="right">{point.lat}</TableCell>
//                                 <TableCell align="right">
//                                   {point.long}
//                                 </TableCell>
//                               </TableRow>
//                             ))
//                           : null}
//                       </TableBody>
//                     </Table>
//                     <CardActions>
//                       <IconButton
//                         edge="start"
//                         color="primary"
//                         aria-label="Add new point of interest"
//                         onClick={this.handleAddPointOpen}
//                       >
//                         <AddBoxIcon />
//                       </IconButton>
//                     </CardActions>
//                   </TableContainer>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Box>
//         </Dialog>
//         <Dialog
//           open={this.state.addPointOpen}
//           onClose={this.handleAddPointClose}
//         >
//           <DialogTitle>Add new point</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               <Typography>
//                 Please enter the details of your new point
//               </Typography>
//             </DialogContentText>
//             <Box my={2}>
//               <TextField
//                 autoFocus
//                 id="name"
//                 label="name"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 onChange={this.handleAddPointInputChange}
//                 error={this.state.addPointError === 'name'}
//               />
//             </Box>
//             <Box mb={2}>
//               <TextField
//                 id="lat"
//                 label="lat"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 onChange={this.handleAddPointInputChange}
//                 error={this.state.addPointError === 'lat'}
//               />
//             </Box>
//             <Box mb={2}>
//               <TextField
//                 id="long"
//                 label="long"
//                 type="text"
//                 fullWidth
//                 variant="outlined"
//                 onChange={this.handleAddPointInputChange}
//                 error={this.state.addPointError === 'long'}
//               />
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={this.handleAddPointSave} color="primary">
//               Save
//             </Button>
//             <Button onClick={this.handleAddPointClose} color="secondary">
//               Cancel
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </>
//     );
//   }
// }

// class Create extends Component {
//   constructor() {
//     super();
//     this.mapSelect = createRef();
//     this.mapEditor = createRef();
//     this.state = {
//       clickedMap: null,
//     };
//     this.cardClickHandler = this.cardClickHandler.bind(this);
//   }

//   // MapSelect click handler
//   cardClickHandler(clickedMap) {
//     this.setState({
//       clickedMap: clickedMap,
//     });
//     this.mapEditor.current.setState({ open: true, map: clickedMap });
//   }

//   render() {
//     return (
//       <>
//         <Header />
//         <Container>
//           <Box my={2}>
//             <Grid container justify="space-between">
//               <Typography variant="h4">
//                 Create a new map or edit one of your existing maps
//               </Typography>
//               <StartCreateNewMap
//                 mapSelectRef={this.mapSelect}
//                 ref={this.mapSelect}
//               />
//             </Grid>
//           </Box>
//           <MapSelect
//             ref={this.mapSelect}
//             clickHandler={this.cardClickHandler}
//             actionItems
//           />
//         </Container>
//         <MapEditor ref={this.mapEditor} />
//       </>
//     );
//   }

//   // render() {
//   //   return (
//   //     <>
//   //       <MapViewCard mapID="6074d236155b07b430f47acf" />
//   //     </>
//   //   );
//   // }
// }


// Invidual card for each map
// Takes in the map OBJ it is displaying as well as optionally a designated
// click handler in props
const MapCard = (props) => {
  // Function which runs the defined click handler if provided
  // const delegateClick = () =>
  //   'clickHandler' in props ? props.clickHandler(props.map) : null;
  const {onSelectMap, onDelete, title, description} = props;

  return (
    <Box minWidth={window.innerWidth < 600 ? '90vw' : null}>
      <Card raised>
        <CardActionArea id={title} onClick={() => onSelectMap()}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <Typography>{description}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton aria-label="delete map" onClick={() => onDelete()}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
};

class MapEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedSelectedMap: null,
    }
  }

  componentDidUpdate(prevProps) {
    const {selectedMap} = this.props;
    if (!isEqual(selectedMap, prevProps.selectedMap)) {
      this.setState({editedSelectedMap: cloneDeep(selectedMap)});
    }
  }

  onUpdateField(field, newValue) {
    const {editedSelectedMap} = this.state;
    editedSelectedMap[field] = newValue;
    this.setState({editedSelectedMap});
  }

  onUpdatePointOfInterest(index, field, newValue) {
    console.log(`Updating point ${index} field ${field} to ${newValue}`);
    const {editedSelectedMap} = this.state;
    const point = editedSelectedMap.pointsOfInterest[index];
    point[field] = newValue;
    this.setState({editedSelectedMap});
  }

  onUpdatePointOfInterestLatLong(index, lat, long) {
    const {editedSelectedMap} = this.state;
    const point = editedSelectedMap.pointsOfInterest[index];
    point.lat = lat;
    point.long = long;
    this.setState({editedSelectedMap});
  }

  onAddPointOfInterest() {
    const {editedSelectedMap} = this.state;
    editedSelectedMap.pointsOfInterest.push({name: "", lat: "", long: ""});
    this.setState({editedSelectedMap});
  }

  onDeletePointOfInterest(index) {
    const {editedSelectedMap} = this.state;
    editedSelectedMap.pointsOfInterest.splice(index, 1);
    this.setState({editedSelectedMap});
  }

  canSaveMap() {
    const {selectedMap} = this.props;
    const {editedSelectedMap} = this.state;
    if (isEqual(selectedMap, editedSelectedMap)) {
      console.log("Maps equal");
      return false;
    };
    // console.log(JSON.stringify(editedSelectedMap));
    // if (!editedSelectedMap) {
    //   console.log("Map broke")
    // }
    // if (!editedSelectedMap.title) {
    //   console.log("Name broke")
    // }
    // if (!editedSelectedMap.description) {
    //   console.log("description broke")
    // }
    // if (!Array.isArray(editedSelectedMap.pointsOfInterest)) {
    //   console.log("poi array broke")
    // }
    // if (!(editedSelectedMap.pointsOfInterest.length > 0)) {
    //   console.log("poi array too small")
    // }
    // if (
    //   !editedSelectedMap.pointsOfInterest.reduce((accumulator, poi) => {
    //     if (!poi.name) {
    //       console.log("Poi has invalid name")
    //     }
    //     if (isNaN(poi.lat)) {
    //       console.log("Lat NaN")
    //     }
    //     if (isNaN(poi.long)) {
    //       console.log("long NaN")
    //     }
    //     return (
    //       accumulator &&
    //       poi.name &&
    //       !isNaN(poi.lat) &&
    //       !isNaN(poi.long)
    //     )
    //   }, true)) {
    //     console.log("poi array has invalid poi");
    //   }
    return (
      editedSelectedMap &&
      editedSelectedMap.title &&
      editedSelectedMap.description &&
      Array.isArray(editedSelectedMap.pointsOfInterest) &&
      editedSelectedMap.pointsOfInterest.length > 0 &&
      editedSelectedMap.pointsOfInterest.reduce((accumulator, poi) => {
        return (
          accumulator &&
          poi.name &&
          !isNaN(poi.lat) &&
          !isNaN(poi.long)
        )
      }, true)
    )
  }

  onSaveMap() {
    const {onSave} = this.props;
    const {editedSelectedMap} = this.state;
    api.post(`/server/${editedSelectedMap._id ? "updateMap" : "createMap"}`, editedSelectedMap).then(res => {
      console.log(res.data);
      if (res.data.message) {
        onSave();
      }
    })
    
  }


  openLocationSelectDialog(index) {
    const {user} = this.props;
    const {editedSelectedMap} = this.state;
    const poi = editedSelectedMap.pointsOfInterest[index];
    const validPoints = editedSelectedMap.pointsOfInterest.filter((pt, ptIndex) => !(isNaN(pt.lat) || isNaN(pt.long) && index != ptIndex));
    const defaultCenter = validPoints.length > 0 ? (
      Object.values(validPoints.reduce((accumulator, pt) => {
        accumulator.lat += pt.lat;
        accumulator.long += pt.long;
        return accumulator;
      }, {lat: 0, long: 0})).map(val => val / validPoints.length)
    ) : [
      user.demographics.homebase.lat,
      user.demographics.homebase.long,
    ];
    const coordinates = cloneDeep(poi);
    if (!coordinates.lat) coordinates.lat = "";
    if (!coordinates.long) coordinates.long = "";
    this.setState({
      locationSelect: {
        title: `Select location for ${poi.name}`,
        otherPoints: editedSelectedMap.pointsOfInterest.filter((pt, ptIndex) => index != ptIndex),
        defaultCenter,
        coordinates,
        onAccept: (lat, long) => {this.onUpdatePointOfInterestLatLong(index, lat, long)}
      }
    });
  }

  cancelLocationSelectDialog() {
    this.setState({locationSelect: false});
  }

  acceptLocationSelectDialog() {
    const {locationSelect} = this.state;
    const {lat, long} = locationSelect.coordinates;
    locationSelect.onAccept(lat, long);
    this.setState({locationSelect: false});
  }

  onLocationSelect(lat, long) {
    const {locationSelect} = this.state;
    locationSelect.coordinates.lat = lat;
    locationSelect.coordinates.long = long;
    this.setState({locationSelect});
  }

  render() {
    const {selectedMap, user, onCancel, onSave} = this.props;
    const {editedSelectedMap, locationSelect} = this.state;
    if (!editedSelectedMap) return <></>;
    // console.log(selectedMap);
    return <>
      <Dialog fullScreen open={editedSelectedMap} onClose={() => onCancel()}>
        {locationSelect &&
          <Dialog
            open={locationSelect}
            onClose={() => {this.cancelLocationSelectDialog()}}
          >
            <DialogTitle>
              {locationSelect.title}
            </DialogTitle>
            <DialogContent>
              <PointSelect 
                otherPoints={locationSelect.otherPoints}
                defaultCenter={locationSelect.defaultCenter}
                onPointSelect={(lat, long) => this.onLocationSelect(lat, long)}
                defaultPoint={locationSelect.coordinates}
              />
              {locationSelect.coordinates && 
                <DialogContentText>
                  {locationSelect.coordinates.lat}, {locationSelect.coordinates.long}
                </DialogContentText>
              }
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={() => {this.cancelLocationSelectDialog()}}>
                Cancel <CancelIcon style={{marginLeft: "10px"}}/>
              </Button>
              <Button variant="contained" color="primary" style={{marginLeft: "10px"}} onClick={() => {this.acceptLocationSelectDialog()}}>
                Save <SaveIcon style={{marginLeft: "10px"}}/>
              </Button>
            </DialogActions>
          </Dialog>
        }
        <Box mx={4}>
          <Grid container justify="flex-end" alignItems="center">
            <Grid item xs={9}>
              {selectedMap ? (
                <Box mt={3}>
                  <Typography variant="h3">{editedSelectedMap.title}</Typography>
                  <Typography>{editedSelectedMap.description}</Typography>
                </Box>
              ) : null}
            </Grid>
            <Grid item xs={3}>
              {/* <IconButton
                edge="start"
                color="inherit"
                onClick={() => onCancel()}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton> */}
              <Button variant="contained" color="primary" style={{margin: "5px"}} onClick={() => onCancel()}>
                Cancel <CancelIcon style={{marginLeft: "10px"}}/>
              </Button>
              <Button variant="contained" color="primary" style={{margin: "5px"}} disabled={!this.canSaveMap()} onClick={() => this.onSaveMap()}>
                Save <SaveIcon style={{marginLeft: "10px"}}/>
              </Button>
            </Grid>
          </Grid>
          <Box mt={10}>
            <Grid container justify="space-evenly">
              <Grid item>
                {editedSelectedMap ? (
                  <MapDisplay 
                    mapData={editedSelectedMap}
                    defaultMapCenter={
                      user && user.demographics && user.demographics.homebase && [
                        user.demographics.homebase.lat,
                        user.demographics.homebase.long,
                      ]
                    }
                  />
                ) : null}
              </Grid>
            </Grid>
          </Box>
          <Box mt={10}>
            <Grid container justify="space-evenly">
              <Grid container justify="space-evenly" style={{width: "75%", margin: "20px"}}>
                <Grid item xs={4}>
                  <TextField 
                    label="Title"
                    value={editedSelectedMap.title}
                    type="text"
                    onChange={event => this.onUpdateField("title", event.target.value)}
                    style={{width: "100%"}}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField 
                    label="Description"
                    value={editedSelectedMap.description}
                    type="text"
                    onChange={event => this.onUpdateField("description", event.target.value)}
                    style={{width: "100%"}}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="space-evenly">
              <Grid item>
                <TableContainer
                  component={Card}
                  raised
                >
                  <Table aria-label="Points of Interest Table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name of Location</TableCell>
                        <TableCell align="right">Lat</TableCell>
                        <TableCell align="right">Long</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {editedSelectedMap
                        ? editedSelectedMap.pointsOfInterest.map((point, index) => (
                            <TableRow key={`Point ${index}`}>
                              <TableCell component="th" scope="row">
                                {/* {point.name} */}
                                <TextField 
                                  value={point.name}
                                  type="text"
                                  onChange={event => this.onUpdatePointOfInterest(index, "name", event.target.value)}
                                  style={{width: "100%"}}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {/* {point.lat} */}
                                <TextField 
                                  value={point.lat}
                                  type="number"
                                  onChange={event => this.onUpdatePointOfInterest(index, "lat", event.target.value)}
                                  style={{width: "100%"}}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {/* {point.long} */}
                                <TextField 
                                  value={point.long}
                                  type="number"
                                  onChange={event => this.onUpdatePointOfInterest(index, "long", event.target.value)}
                                  style={{width: "100%"}}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton aria-label="edit point location" onClick={() => this.openLocationSelectDialog(index)}>
                                  <PlaceIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <IconButton aria-label="edit point location" onClick={() => this.onDeletePointOfInterest(index)}>
                                  <DeleteIcon />
                                </IconButton>
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
                      onClick={() => this.onAddPointOfInterest()}
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
    </>
  }
}

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: [],
      selectedMap: null,
      loading: true,
    }
  }

  fetchData() {
    api.get('/server/getActiveUserMaps').then(mapRes => {
      api.get('/server/getActiveUser').then(userRes => {
        console.log(mapRes.data);
        console.log(userRes.data);
        this.setState({
          maps: mapRes.data,
          user: userRes.data,
          loading: false,
        })
      })
    })
  }

  componentDidMount() {
    this.fetchData();
  }

  startCreateMap() {
    // const {maps} = this.state;
    this.setState({
      selectedMap: {
        title: "",
        description: "",
        pointsOfInterest: [],
      }
    });
  }

  onSelectMap(map) {
    console.log("Selecting map:");
    console.log(map);
    this.setState({
      selectedMap: map,
    });
  }

  onCancelMapSelect() {
    this.setState({
      selectedMap: null,
    })
  }

  onSaveMapEdits() {
    this.fetchData();
    this.onCancelMapSelect();
  }

  onDeleteMap(map) {
    console.log("Opening warning dialog for map deletion");
    this.openWarningDialog(
      "Are you sure you want to delete this map?",
      `Map deletion cannot be undone! Are you sure you want to delete ${map.title || "this map"}?`,
      () => {
        api.post('/server/deleteMap', {mapID: map._id}).then(res => {
          console.log(res.data);
          this.fetchData();
        })
      }
    )
  }

  /**
   * Open a dialog letting users opt out of a risky action if they wish to cancel
   * @param {String} warningTitle 
   * @param {String} warningText 
   * @param {Function} acceptFunction Function that runs on accepting the warning
   */
  openWarningDialog(warningTitle, warningText, acceptFunction) {
    this.setState({
      warning: {warningTitle, warningText, acceptFunction}
    });
  }

  /**
   * Close warning dialog
   */
  cancelWarningDialog() {
    this.setState({warning: false});
  }

  /**
   * Accept the warning dialog and run the associated function
   */
  acceptWarningDialog() {
    const {warning} = this.state;
    if (warning && warning.acceptFunction) warning.acceptFunction();
    this.setState({warning: false});
  }

  render() {
    const {maps, user, selectedMap, warning, loading} = this.state;
    return <>
      {warning &&
        <Dialog
          open={warning}
          onClose={() => {this.cancelWarningDialog()}}
        >
          <DialogTitle>
            {warning.warningTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {warning.warningText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => {this.cancelWarningDialog()}}>
              Cancel <CancelIcon style={{marginLeft: "10px"}}/>
            </Button>
            <Button variant="contained" color="primary" style={{marginLeft: "10px"}} onClick={() => {this.acceptWarningDialog()}}>
              Continue <SaveIcon style={{marginLeft: "10px"}}/>
            </Button>
          </DialogActions>
        </Dialog>
      }
      <Header />
      <Container>
        <Box my={2}>
          <Grid container justify="space-between">
            <Typography variant="h4">
              Create a new map or edit one of your existing maps
            </Typography>
            <Button color="primary" variant="contained" onClick={() => this.startCreateMap()}>
              Create a map
            </Button>
          </Grid>
        </Box>
        {loading ? 
          <RollBoxLoading color="#acacac" />
        :
          <Grid
            container
            alignItems="center"
            spacing={window.innerWidth > 600 ? 5 : 1}
          >
            {maps.map((map) => (
              <Grid item key={map.title}>
                <MapCard
                  title={map.title}
                  description={map.description}
                  onSelectMap={() => this.onSelectMap(map)}
                  onDelete={() => this.onDeleteMap(map)}
                />
              </Grid>
            ))}
          </Grid>
        }

      </Container>
      <MapEditor 
        selectedMap={selectedMap}
        onCancel={() => this.onCancelMapSelect()}
        onSave={() => this.onSaveMapEdits()}
        user={user}
      />
    </>
  }
}

export default Create;
