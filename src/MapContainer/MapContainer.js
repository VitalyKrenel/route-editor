import './MapContainer.css';

import React, { Component } from 'react';
import { YMaps, Map } from 'react-yandex-maps';

const apikey = '262287d2-a40d-4b35-b808-7d4231cb5915';
// const modules = ['geocode'];
const mapState = { center: [55.75, 37.57], zoom: 9 };

export const generateGeometry = () => {
  const [coordX, coordY] = mapState.center;  
  return [
    coordX + Number(Math.random().toFixed(4)),
    coordY + Number(Math.random().toFixed(4)),
  ];
};

export default class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapIsLoaded: false,
    };

    this.handleLoad = this.handleLoad.bind(this);
  }

  handleLoad() {
    this.setState({ mapIsLoaded: true })
  }

  render() {
    const { mapIsLoaded } = this.state;

    let mapContainer = {
      className: 'MapContainer',
    };

    if (!mapIsLoaded) {
      mapContainer.className += ' MapContainer_status_loading';
    }

    return (
      <div { ...mapContainer }>
        <YMaps query={{apikey}}>
          <Map 
            className="Map"  
            defaultState={mapState} 
            onLoad={this.handleLoad}>
          </Map>
        </YMaps>
      </div>
    );
  }
}
