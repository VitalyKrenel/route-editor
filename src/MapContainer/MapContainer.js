import './MapContainer.css';

import React, { Component } from 'react';
import { YMaps, Map } from 'react-yandex-maps';

const apikey = '262287d2-a40d-4b35-b808-7d4231cb5915';
const modules = ['multiRouter.MultiRoute'];
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

  handleLoad(ymaps) {
    this.ymaps = ymaps;
    this.setState({ mapIsLoaded: true });
  }

  createRoute(locations) {
    const addressList = locations.map((location) => location.value);   

    const multiRoute = new this.ymaps.multiRouter.MultiRoute({
      referencePoints: addressList,
    });

    this.map.geoObjects.removeAll();
    this.map.geoObjects.add(multiRoute);
  }

  render() {
    const { mapIsLoaded } = this.state;

    let mapContainer = {
      className: 'MapContainer',
    };

    if (!mapIsLoaded) {
      mapContainer.className += ' MapContainer_status_loading';
    }

    const { locations } = this.props;

    if (this.ymaps && this.locations !== 0) {
      this.createRoute(locations);
    }

    return (
      <div { ...mapContainer }>
        <YMaps query={{apikey}}>
          <Map
            className="Map"
            modules={modules}  
            defaultState={mapState} 
            onLoad={this.handleLoad}
            instanceRef={ref => (this.map = ref)}
          >
          </Map>
        </YMaps>
      </div>
    );
  }
}
