import './MapContainer.css';

import React, { Component } from 'react';
import { YMaps, Map } from 'react-yandex-maps';

const apikey = '262287d2-a40d-4b35-b808-7d4231cb5915';
const modules = ['multiRouter.MultiRoute'];
const mapDefaults = { center: [55.75, 37.57], zoom: 9 };

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

    const initialRoute = new this.ymaps.multiRouter.MultiRoute({
      referencePoints: this.props.locations.map((loc) => loc.value),
    });

    initialRoute.model.events.add('requestsuccess', (e) => {
      const wayPoints = initialRoute.getWayPoints();
      const lastIndex = wayPoints.getLength() - 1;
      const lastPoint = wayPoints.get(lastIndex);
      
      const center = (lastIndex >= 0 && lastPoint.geometry.getCoordinates());
      if (center) {
        this.map.setCenter(center, mapDefaults.zoom, {
          duration: 500,
        });
      }
    });

    this.setState({ mapIsLoaded: true });
    this.map.geoObjects.add(initialRoute);
  }

  updateRoute(locations) {
    const addressList = locations.map((location) => location.value);   
    this.map.geoObjects.get(0).model.setReferencePoints(addressList);
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

    if (this.ymaps) {
      this.updateRoute(locations);
    }

    return (
      <div { ...mapContainer }>
        <YMaps query={{apikey}}>
          <Map
            className="Map"
            modules={modules}  
            defaultState={mapDefaults}
            onLoad={this.handleLoad}
            instanceRef={ref => (this.map = ref)}
          >
          </Map>
        </YMaps>
      </div>
    );
  }
}
