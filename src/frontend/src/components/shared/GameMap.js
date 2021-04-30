import React, { Component } from 'react';
import {
  Box,
} from '@material-ui/core';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Popup,
  Tooltip,
  MapConsumer,
  Marker
} from 'react-leaflet';
import DefaultMarker from '@assets/img/mapPinDefault.svg';
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';
import { geolocated } from 'react-geolocated';
import { RollBoxLoading } from 'react-loadingg';
import HaversineGeolocation from 'haversine-geolocation';
import API from '@root/src/api';

var timerObj
class GameMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      latlng: this.props.currLoc, // used for current latitude and longitude
      ready: false, // used to display map once we're ready
      numSegs: 8, // length of snake
      segLen: 15, // length of snake segment in meters
      internalSnake: [], // holds the internal snake latlng points
      points: 0, // calculated by (lives*mod) + (distTraveled*mod) at end of game
      lives: 3, // how many lives
      gameOver: false, // used to display end-of-game portion
      win: false, // bonus for winning
      poisLeft: 10, // number of POIs left in the game
      poiArr: [], // array containing all POIs
      activePoi: {}, // obj holding current POI (name/lat/lng)
      date: new Date(Date.now()), // when the game started
      distTraveled: 0, // how long the player traveled
      timeElapsed: 0 // in milliseconds
    };
    this.calcPlace = this.calcPlace.bind(this);
  }

  componentDidMount() {
    var initsnake = []
    for (var i=0; i<this.state.numSegs; i++){
      initsnake = initsnake.concat([[this.state.latlng.lat, this.state.latlng.lon]])
    }
    API.get('/api/v1/maps/' + this.props.mapId).then((mapData) => {
      this.setState({
        poiArr: mapData.data.pointsOfInterest,
        activePoi: mapData.data.pointsOfInterest[Math.floor(Math.random() * mapData.data.pointsOfInterest.length)],
        internalSnake: initsnake
      }, () => {
        this.repeat()
      });
    })
  }

  repeat = () => {
    this.setState({ready: true})
    timerObj = setTimeout(() => {
      // updates position every 0.5 seconds
      this.setState({timeElapsed: this.state.timeElapsed + 500})
      navigator.geolocation.getCurrentPosition(this.calcPlace)
    }, 500);
  };

  breakRepeat = () => {
    clearTimeout(timerObj)
    // point calculation
    var finalPoints = 0;
    finalPoints += (this.state.distTraveled * 5) // idk how i want to do this, this could be tweaked in the future
    finalPoints += (this.state.lives * 500) // give extra weight lol
    if(this.state.win){ // extra points on a win
      finalPoints += 1000
    }
    this.setState({
      points: finalPoints
    }, this.uploadData());
  }

  uploadData = () => {
    var gameDataForUpload = {
      points: this.state.points,
      date: this.state.date,
      map: this.props.mapId,
      elapsed: this.state.timeElapsed
    }
    API.post("/api/v1/endGame", gameDataForUpload);
  }
  
  calcPlace(pos) { // handles all of the messy stuff
    var crd = pos.coords;
    var currLatlng = {
      lat: crd.latitude,
      lon: crd.longitude,
    }
    this.setState({latlng: currLatlng});
    var points = [
      {
        latitude: currLatlng.lat,
        longitude: currLatlng.lon
      },
      {
        latitude: this.state.internalSnake[0][0],
        longitude: this.state.internalSnake[0][1]
      }
    ]
    // check poi intersection
    var poiPoints = [
      {
        latitude: this.state.activePoi.lat,
        longitude: this.state.activePoi.long
      },
      {
        latitude: crd.latitude,
        longitude: crd.longitude
      }
    ]
    if (HaversineGeolocation.getDistanceBetween(poiPoints[0], poiPoints[1], 'm') < 15 + crd.accuracy){
      var updateSnake = this.state.internalSnake;
      updateSnake.push(updateSnake[updateSnake.length - 1]);
      this.setState({
        poisLeft: this.state.poisLeft-1, // reduce poisLeft
        numSegs: this.state.numSegs+1, // increase segments
        activePoi: this.state.poiArr[Math.floor(Math.random() * this.state.poiArr.length)], // update POI
        internalSnake: updateSnake
      }, () => {
        if(this.state.poisLeft == 0){ // if no more POIs, we're done
          this.setState({
            gameOver: true,
            win: true // make sure to tell them that they win
          }, () => {
            this.breakRepeat(); // break the repeat
          })
        }
      })
    }
    var m_diff = HaversineGeolocation.getDistanceBetween(points[0], points[1], 'm')
    if (m_diff >= (15 + crd.accuracy)){
      this.setState({
        distTraveled: this.state.distTraveled + m_diff
      }) // nothing after this in this function requires this, and by the time calcPlace() is called again it should be done, given repeatTimer taking 500ms
      // check collision
      // references this post https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
      var ll = [[currLatlng.lat, currLatlng.lon], [this.state.internalSnake[0][0], this.state.internalSnake[0][1]]]
      for (var i = 0; i < this.state.numSegs-1; i++){
        var cl = [[this.state.internalSnake[i][0], this.state.internalSnake[i][1]], [this.state.internalSnake[i+1][0], this.state.internalSnake[i+1][1]]]
        var det, gamma, lambda;
        var a = ll[0][0], b = ll[0][1], c = ll[1][0], d=ll[1][1], p=cl[0][0], q=cl[0][1], r=cl[1][0], s=cl[1][1]
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0){ // no intersection
          continue; // do nothing
        } else {
          lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
          gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
          if ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)){ // intersection
            this.setState({
              lives: this.state.lives -1
            }, () => {
              if (this.state.lives == 0){ // game over
                this.setState({
                  gameOver: true
                }, () => {
                  this.breakRepeat() // break repeat
                })
              }
            })
          } else {
            continue;
          }
        }
      }
      // update snake
      var updateSnake = this.state.internalSnake;
      for (var i = this.state.numSegs-1; i >= 0; i--){
        if (i === 0){
          updateSnake[i] = [currLatlng.lat, currLatlng.lon];
        }
        else {
          updateSnake[i] = updateSnake[i-1];
        }
      }
      this.setState({internalSnake: updateSnake}, this.repeat)
    }
    else {
      this.repeat();
    }
  }

  snakeTrail = {color: 'black'}

  render() {
    return (
      <>
          {
            this.state.ready ? (
              this.state.gameOver ? ( // game over
                this.state.win ? ( // you win
                  <h1>You win!</h1>
                ) : ( // you lose
                  <h1>You lose...</h1>
                )
              ) : ( // game not over
              <div>
                <MapContainer center={this.state.latlng} zoom={13}>
                  <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                  />
                  <MapConsumer>
                    {(map) => {
                      var firstPolyLine = new L.Polyline(this.state.internalSnake, this.snakeTrail);
                      for (var i in map._layers){
                        if (map._layers[i]._path != undefined){ 
                          try {
                            map.removeLayer(map._layers[i]);
                          }
                          catch(e) {
                            console.log("problem with " + e + map._layers[i]);
                          }
                        }
                      }
                      map.addLayer(firstPolyLine);
                      return null;
                    }}
                  </MapConsumer>
                  <ReactLeafletDriftMarker
                    position={this.state.latlng}
                    duration={750}
                    keepAtCenter={true}
                    icon={
                      new Icon({
                        iconUrl: DefaultMarker,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  >
                    <Popup>
                      Latitude: {this.state.latlng.lat},
                      Longitude: {this.state.latlng.lon}
                    </Popup>
                    <Tooltip>Snake Head</Tooltip>
                  </ReactLeafletDriftMarker>
                  <Marker
                    key={this.state.activePoi.name}
                    position={[this.state.activePoi.lat, this.state.activePoi.long]}
                    icon={
                      new Icon({
                        iconUrl: DefaultMarker,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  >
                    <Popup>{this.state.activePoi.name}</Popup>
                  </Marker>
                </MapContainer>
                <Box m={3}>
                  <h1>LIVES: {this.state.lives}</h1>
                  <h1>POIs LEFT: {this.state.poisLeft}</h1>
                </Box>
              </div>
              )
            ) : (
              <RollBoxLoading color="#acacac" />
            )
          }
      </>
    );
  }
}
export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  },
})(GameMap);