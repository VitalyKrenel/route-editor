import './MapContainer.css';

import React, { Component } from 'react';
import { YMaps, Map } from 'react-yandex-maps';

const apikey = '262287d2-a40d-4b35-b808-7d4231cb5915';
const modules = [
  'multiRouter.MultiRoute',
  'geocode',
  'geoObject.addon.balloon',
  'templateLayoutFactory',
];

const mapDefaults = { center: [55.75, 37.57], zoom: 12 };
const routeOptions = (ymaps) => ({
  wayPointDraggable: true,
  preventDragUpdate: true,
  // Force route to keep the same color even when being inactive
  routeStrokeColor: '#a051cf',
  routeActiveStrokeColor: '#a051cf',
  routeOpacity: 1,
  // Stop opening balloon on route click (wayPoints handled separately)
  routeOpenBalloonOnClick: false, 
  wayPointBalloonContentLayout: ymaps.templateLayoutFactory.createClass(
    '{{ properties.address|raw }}'
  ),
});

export default class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.container = React.createRef();
    this.ymaps = null;

    this.handleLoad = this.handleLoad.bind(this);
    this.handleRouteRequestSuccess = this.handleRouteRequestSuccess.bind(this);

    this.updateMapCenter = this.updateMapCenter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { locations } = this.props;

    if (!this.ymaps) {
      return;
    }

    this.updateRoute(locations);

    if (locations.length > prevProps.locations.length) {
      // Update map center if new point was added and after route is updated  
      this.initialRoute.model.events.once('requestsuccess', () => {
        const wayPoints = this.initialRoute.getWayPoints();
        const lastWayPoint = wayPoints.get(wayPoints.getLength() - 1);

        this.updateMapCenter(lastWayPoint.geometry.getCoordinates());
      });
    }
  }

  updateMapCenter(coords) {
    this.map.setCenter(coords, mapDefaults.zoom, {
      duration: 500,
    });
  }

  updateRoute(locations) {
    const addressList = locations.map((location) => location.value);
    this.initialRoute.model.setReferencePoints(addressList);
  }

  handleRouteRequestSuccess(ymaps) {
    const wayPoints = this.initialRoute.getWayPoints().toArray();
    /* Debug */
      console.group('Route request success');
      console.count('Route rebuilds: ');
      console.log(wayPoints);
      console.groupEnd('Route request success');
    /* #Debug */

    /** 
     * Note: This eliminates the neccessity of creating own balloon yout,
     * but I didn't find a way to attach this addon directly to route, so
     * I wouldn't have to handle this manually each time wayPoints 
     * get updated.
     * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geoObject.addon.balloon-docpage/ 
     */
    // Add Yandex Balloon for every wayPoint when points get updated
    wayPoints.forEach((wayPoint) => {
      ymaps.geoObject.addon.balloon.get(wayPoint);
    });
  }

  handleLoad(ymaps) {
    this.ymaps = ymaps;
    const { locations } = this.props;

    this.initialRoute = new ymaps.multiRouter.MultiRoute({
      referencePoints: locations.map((loc) => loc.value),
      params: {
        // Limit routes number to 1, otherwise additional routes are shown
        results: 1,
        reverseGeocoding: true,
      }
    },  routeOptions(ymaps));

    this.initialRoute.model.events.add('requestsuccess', () => {
      this.handleRouteRequestSuccess(ymaps);
    });

    this.container.current.classList.remove('MapContainer_status_loading');
    this.map.geoObjects.add(this.initialRoute);
  }

  render() {
    return (
      <div
        className="MapContainer MapContainer_status_loading"
        ref={this.container}
      >
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
