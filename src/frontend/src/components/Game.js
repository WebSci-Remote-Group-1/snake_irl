import React from 'react';
import {
  Container,
} from '@material-ui/core';
import HaversineGeolocation from 'haversine-geolocation';
import Header from './shared/Header.js'
import API from '../api';

var internal_snake = [] // initialized at current location
var num_segs = 8;
var uninitialized = true;
var seg_len = 10;
var err_margin = 0.0;



var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
function success(pos) {
  var crd = pos.coords;
  var i = 0;
  if(uninitialized){
    for(i = 0; i < num_segs; i++){
      internal_snake[i] = [crd.latitude, crd.longitude]
    }
    err_margin = crd.accuracy;
    uninitialized = false;
  }
  else{
    var points = [
      {
        latitude: crd.latitude,
        longitude: crd.longitude
      },
      {
        latitude: internal_snake[0][0],
        longitude: internal_snake[0][1]
      }
    ]
    var m_diff = HaversineGeolocation.getDistanceBetween(points[0], points[1], 'm');
    if(m_diff >= seg_len){
      for(i = num_segs-1; i >= 0; i--){
        if(i === 0){
          internal_snake[i] = [crd.latitude, crd.longitude];
        }
        else{
          internal_snake[i] = internal_snake[i-1]
        }
      }
    }
  }
  console.log(JSON.stringify(internal_snake));
}

function errors(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

export default class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {intervalId: 0}
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    let self = this;
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            clearInterval(self.state.intervalId);
            let intervalId = setInterval(() => 
              navigator.geolocation.getCurrentPosition(success, errors, options), 500);
            self.setState({intervalId: intervalId})
          } else if (result.state === "prompt") {
            clearInterval(self.state.intervalId);
            let intervalId = setInterval(() => 
              navigator.geolocation.getCurrentPosition(success, errors, options), 500);
            self.setState({intervalId: intervalId})
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
            if (result.state === "granted"){
              clearInterval(self.state.intervalId);
              let intervalId = setInterval(() => 
                navigator.geolocation.getCurrentPosition(success, errors, options), 500);
              self.setState({intervalId: intervalId})
            }
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    return (
      <>
        <Header/>
        <Container>
        </Container>
      </>
    );
  }
}