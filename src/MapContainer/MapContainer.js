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

    const initialRoute = new ymaps.multiRouter.MultiRoute({
      referencePoints: this.props.locations.map((loc) => loc.value),
    }, {
      wayPointDraggable: true,
    });

    const map = this.map;
  
    const updateMapCenter = (e) => {
      const { locations } = this.props;
      const lastLocationPoint = locations[locations.length - 1];

      // Note: multiRoute referencePoints is represented as unordered data
      // structure, so to find the real last point I filter all points by
      // location value (address) criteria 
      const lastWayPoint = initialRoute.getWayPoints().toArray().filter(
        (wayPoint) => {
          return lastLocationPoint.value === wayPoint.properties.get('request');
        }).pop();

      if (lastWayPoint) {
        // Duration param adds transition between prev and new centers
        map.setCenter(lastWayPoint.geometry.getCoordinates(), 
          mapDefaults.zoom, {
          duration: 500,
        });
      }
    };
  
    
    initialRoute.model.events.add('requestsuccess', updateMapCenter);

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
