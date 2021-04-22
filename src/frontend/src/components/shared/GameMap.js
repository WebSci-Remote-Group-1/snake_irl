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
import {geolocated} from 'react-geolocated';
import HaversineGeolocation from 'haversine-geolocation';

class GameMap extends Component {
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
    this.setState({internalSnake: initsnake}, () => {this.repeat()});
  }

  repeat = () => {
    setTimeout(() => {
      // updates position every 5 sec
      this.calcPlace();
    }, 500);
  };
  
  calcPlace() {
    var crd = this.props.coords;
    var currLatlng = {
      lat: crd.latitude,
      lng: crd.longitude,
    }
    var curErrMargin = crd.accuracy;

    this.setState({latlng: currLatlng, errMargin: curErrMargin});
    var points = [
      {
        latitude: currLatlng.lat,
        longitude: currLatlng.lng
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
          updateSnake[i] = [currLatlng.lat, currLatlng.lng];
        }
        else{
          updateSnake[i] = updateSnake[i-1];
        }
      }
      this.setState({internalSnake: updateSnake}, this.repeat)
    }
    else{
      this.repeat();
    }
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
export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  },
})(GameMap);