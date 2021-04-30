import React, { Component } from 'react';
import Leaflet, { Icon } from 'leaflet';
import { Box } from '@material-ui/core';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  MapConsumer,
} from 'react-leaflet';
import { RollBoxLoading } from 'react-loadingg';

import API from '@root/src/api';
import DefaultMarker from '@assets/img/mapPinDefault.svg';

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

class MapDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapID: props.mapID,
      mapObj: null,
      loading: true,
      mapCenter: [42.72983440371727, -73.68997137045602],
    };
  }

  async componentDidMount() {
    let mapData;
    if (this.props.mapData) {
      mapData = this.props.mapData;
    }  else {
      mapData = await API.get(`/api/v1/maps/${this.state.mapID}`);
      mapData = mapData.data;
    }
    this.setState({ loading: false, mapObj: mapData });
    if (mapData.pointsOfInterest.length) {
      let mapCenter = [0, 0];
      mapData.pointsOfInterest.map((point) => {
        mapCenter[0] += point.lat;
        mapCenter[1] += point.long;

        return null;
      });
      mapCenter[0] /= mapData.pointsOfInterest.length;
      mapCenter[1] /= mapData.pointsOfInterest.length;

      this.setState({ mapCenter: mapCenter });
    } else if (this.props.defaultMapCenter) {
      this.setState({ mapCenter: this.props.defaultMapCenter });
    }
  }

  render() {
    return (
      <>
        <Box width="50%" minWidth="200px" height="100%" minHeight="200px">
          {this.state.loading ? (
            <RollBoxLoading speed={250} color="#acacac" />
          ) : (
            <MapContainer center={this.state.mapCenter} zoom={16}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
              <MapConsumer>
                {(map) => {
                  map.flyTo({
                    lat: this.state.mapCenter[0],
                    lng: this.state.mapCenter[1],
                  });
                  return null;
                }}
              </MapConsumer>
              {this.state.mapObj.pointsOfInterest.map((poi) => {
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
              })}
            </MapContainer>
          )}
        </Box>
      </>
    );
  }
}

export default MapDisplay;
