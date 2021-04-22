import React, { Component } from 'react';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Popup,
  Tooltip,
  MapConsumer
} from 'react-leaflet';
import DefaultMarker from '@assets/img/mapPinDefault.svg';
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';
import HaversineGeolocation from 'haversine-geolocation';

export default class GameMap extends Component {
  mapCenter = {
    lat: 42.72983440371727,
    lng: -73.68997137045602
  };

  state = {
    latlng: this.mapCenter,
    grantedAccess: true,
    numSegs: 8,
    segLen: 10,
    errMargin: 0.0,
    internalSnake: []
  };

  componentDidMount() {
    let self = this;
    var initsnake = []
    for(var i=0; i<this.state.numSegs; i++){
      initsnake = initsnake.concat([[this.mapCenter.lat, this.mapCenter.lng]])
    }
    this.setState({internalSnake: initsnake}, () => {console.log(this.state.internalSnake)});
    if (navigator.geolocation) {
      navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        if (result.state === "granted") {
          console.log(result.state);
          self.repeat();
        } else if (result.state === "denied") {
          self.setState(() => ({
            grantedAccess: false
          }));
        }
        result.onchange = function () {
          console.log(result.state);
          if (result.state === "granted"){
            self.repeat()
          }
        };
      });
    }
  }

  repeat = () => {
    setTimeout(() => {
      // updates position every 5 sec
      this.setState({ latlng: this.gen_position() }, this.repeat);
    }, 2000);
  };

  gen_position() {
    var newLoc = this.state.latlng;  

    newLoc.lat += Math.random() * 0.05 - 0.025;
    newLoc.lng += Math.random() * 0.025 - 0.0125;

    var points = [
      {
        latitude: newLoc.lat,
        longitude: newLoc.lng
      },
      {
        latitude: this.state.internalSnake[0][0],
        longitude: this.state.internalSnake[0][1]
      }
    ]

    var m_diff = HaversineGeolocation.getDistanceBetween(points[0], points[1], 'm')
    if(m_diff >= this.state.segLen){
      var updateSnake = this.state.internalSnake;
      for(var i = this.state.numSegs-1; i >= 0; i--){
        if(i === 0){
          updateSnake[i] = [newLoc.lat, newLoc.lng];
        }
        else{
          updateSnake[i] = updateSnake[i-1];
        }
      }
      this.setState({internalSnake: updateSnake})
    }

    return {
      lat: newLoc.lat,
      lng: newLoc.lng
    };
  }

  snakeTrail = {color: 'black'}

  render() {
    return (
      <>
          {
            this.state.grantedAccess ? (
              <MapContainer center={this.mapCenter} zoom={13}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                <MapConsumer>
                  {(map) => {
                    var firstPolyLine = new L.Polyline(this.state.internalSnake, this.snakeTrail);
                    for (var i in map._layers){
                      if(map._layers[i]._path != undefined){
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
                  duration={2000}
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
                    This is the current head of the snake!
                  </Popup>
                  <Tooltip>Snake Head</Tooltip>
                </ReactLeafletDriftMarker>
              </MapContainer>
            ) : (
              <div>
                <p>
                  {this.state.grantedAccess}
                </p>
                <p>
                  "You need to enable geolocation!"
                </p>
              </div>
            )
          }
      </>
    );
  }
}