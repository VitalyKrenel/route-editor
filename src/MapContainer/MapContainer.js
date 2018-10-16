import './MapContainer.css';

import React, { Component } from 'react';
import { YMaps, Map } from 'react-yandex-maps';

const apikey = '262287d2-a40d-4b35-b808-7d4231cb5915';
const modules = ['multiRouter.MultiRoute', 'geocode'];
const mapDefaults = { center: [55.75, 37.57], zoom: 12 };

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

      const wayPoints = initialRoute.getWayPoints().toArray();

      // Note: suggested that method will be fired at least once after
      // any point has been dragged
      let pointNotInList;
      locations.forEach((locPoint, index) => { 
        const foundIndex = wayPoints.findIndex((wayPoint) => {
          return locPoint.value === wayPoint.properties.get('request');
        });

        
        if (foundIndex === -1) { 
          pointNotInList = { wayPoint: wayPoints[0], locationIndex: index }; 
          console.log(pointNotInList);
        } else {
          // Remove point that wasn't changed so next time less points were 
          // searched through
          wayPoints.splice(foundIndex, 1);
        }
      });

      if (pointNotInList) {
        const { wayPoint, locationIndex } = pointNotInList;
        ymaps.geocode(wayPoint.geometry.getCoordinates(), {
          results: 1,
        }).then((response) => {
          const address = response.geoObjects.get(0).properties.get('text');
          console.log(address);
          return address;
        }).then((address) => {
          this.props.onWayPointDrag(locationIndex, address);
        });
      }

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
