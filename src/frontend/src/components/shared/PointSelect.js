import React, {Component} from 'react';
import Header from './shared/header.js';
import PageBody from './shared/pagebody.js';
import { Button, Card, Typography, TextField, Toolbar, Grid, FormControl, InputLabel, Select, MenuItem, Menu, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { grey } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import API from '../../api';
import Leaflet, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  MapConsumer,
} from 'react-leaflet';

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// WIP component

class MapSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPoint: {
        lat: 42.72983440371727, 
        long: -73.68997137045602
      }
    }
  }

  render() {
    const {selectedPoint} = this.state;
    return (
      <Box width="50%" minWidth="200px" height="100%" minHeight="200px">
        <MapContainer center={[selectedPoint.lat, selectedPoint.long]} zoom={16}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />
          <MapConsumer>
            {(map) => {
              // map.flyTo({
              //   lat: this.state.mapCenter[0],
              //   lng: this.state.mapCenter[1],
              // });
              return null;
            }}
          </MapConsumer>
          {/* {this.state.mapObj.pointsOfInterest.map((poi) => {
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
          })} */}
        </MapContainer>
      </Box>
    );
  }
}