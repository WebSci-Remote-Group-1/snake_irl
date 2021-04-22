import React from 'react';
import {
  Box,
} from '@material-ui/core';
import Leaflet, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  MapConsumer,
} from 'react-leaflet';
import DefaultMarker from '@assets/img/mapPinDefault.svg';
import GameMap from './shared/GameMap.js'
import { RollBoxLoading } from 'react-loadingg';
import HaversineGeolocation from 'haversine-geolocation';
import Header from './shared/Header.js'
import API from '../api';

var uninitialized = true;

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  if(uninitialized){
    uninitialized = false;
  }
}

function errors(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

export default class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      intervalId: 0
    }
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(success, errors, options)
          }
          result.onchange = function () {
            console.log(result.state);
            if (result.state === "granted"){
              navigator.geolocation.getCurrentPosition(success, errors, options)
            }
          };
        });
    } else {
      alert("Sorry, not available!");
    }
  }
  render() {
    return (
      <>
        <Header/>
        <Box width="50%" minWidth="200px" height="100%" minHeight="200px">
          {!uninitialized ? (
            <RollBoxLoading color="#acacac" />
          ) : (
            <GameMap/>
          )}
        </Box>
      </>
    );
  }
}