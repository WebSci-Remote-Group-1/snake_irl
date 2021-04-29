import React, { useState, Component, createRef, forwardRef } from 'react';
import {
  Box,
} from '@material-ui/core';
import 'leaflet/dist/leaflet.css';
import GameMap from './shared/GameMap.js'
import { RollBoxLoading } from 'react-loadingg';
import { useParams } from 'react-router-dom';
import MapSelect from './shared/MapSelect.js'
import Header from './shared/Header.js'
import API from '@root/src/api';
//import queryString from 'query-string';

var uninitialized = true;
export default class Game extends Component {
  constructor(props){
    super(props);
    this.mapSelect = createRef();
    this.state = {
      intervalId: 0,
      currMap: "",
      mapSelected: false,
      rand: ((new URL(document.location)).searchParams.get("rand") == "true"),
      latlng: {
        lat: 0,
        lng: 0
      }
    }
    console.log(this.state.rand) 
    this.cardClickHandler = this.cardClickHandler.bind(this);
    this.success = this.success.bind(this);
  }

  success(pos) {
    if(uninitialized){
      console.log("initialized!")
      var corrlatlng = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }
      if (this.state.rand){ // get random map within area and set the map to that
        API.get('/api/v1/maps').then((mapData) => {
          if (mapData.status === 200){
            var theMap = mapData.data[Math.floor(Math.random() * mapData.data.length)];
            this.setState({
              currMap: theMap._id,
              mapSelected: true,
              latlng: corrlatlng
            })
          }
        })
      }
      else{
        
      this.setState({
        latlng: corrlatlng
      })
      }
      uninitialized = false;
    }
  }

  errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  }

  cardClickHandler(clickedMap) {
    this.setState({
      currMap: clickedMap._id,
      mapSelected: true
    });
  }

  componentDidMount() {
    var self = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(self.success, self.errors, self.options)
    } else {
      alert("Sorry, not available!");
    }
  }
  render() {
    return (
      <>
        <Header/>
        <Box>
        {this.state.mapSelected ? (
          <GameMap mapId={this.state.currMap} currLoc={this.state.latlng}/> /* this doesn't like box... */
        ) : (
          <Box m={3}>
            {this.state.rand ? (
              <RollBoxLoading color="#acacac" />
            ) : (
              <div>
                <h1>Select your map!</h1>
                <MapSelect
                  ref={this.mapSelect}
                  clickHandler={this.cardClickHandler}
                />
              </div>
            )}
          </Box>
        )}
        </Box>
      </>
    );
  }
}