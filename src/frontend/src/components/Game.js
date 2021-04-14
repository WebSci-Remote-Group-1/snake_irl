import React from 'react';
import Header from './shared/Header.js'
import API from '../api';

/*
 * Need a Map component -- maybe move out of MissionSelect into shared?
 */

var internal_snake = [] // initialized at current location
var num_segs = 8;
var uninitialized = true;
var err_margin = 0.0;

function success(pos){
  var crd = pos.coords
  err_margin = crd.accuracy;
  if (uninitialized){ // initialize
    var i;
    for (i=0; i<num_segs; i++){
      internal_snake[i] = (crd.latitude, crd.longitude)
    }
    uninitialized = false;
  }
}

export default class Game extends Component {
  componentDidMount(){
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            //If granted then you can directly call your function here
          } else if (result.state === "prompt") {
            console.log(result.state);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  }
  render() {
    return (
      <div>
        <Header/>
        <Container>
          {/* 
            * Here is where game data goes
            */}
        </Container>
      </div>
    );
  }
}