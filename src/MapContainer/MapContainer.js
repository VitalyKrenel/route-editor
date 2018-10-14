import './MapContainer.css';

import React, { Component } from 'react';
import { YMaps, Map } from 'react-yandex-maps';

const apikey = '262287d2-a40d-4b35-b808-7d4231cb5915';
const modules = ['route'];
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
    const points = locations.map((location) => location.value);   

    const routePromise = this.ymaps.route(points, { 
      multiRoute: true 
    });
    routePromise.then(
      (multiRoute) => {
        this.map.geoObjects.removeAll();
        this.map.geoObjects.add(multiRoute);
      },
      (err) => console.error(err),
    );
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

    if (this.ymaps && locations.length !== 0) {
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
