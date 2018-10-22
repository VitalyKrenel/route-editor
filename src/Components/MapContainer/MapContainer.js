import './MapContainer.css';

import React, { Component } from 'react';
import { Map } from 'react-yandex-maps';

import { diffPoints } from './MapPointsUtils/MapPointsUtils.js';

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

    const differ = diffPoints(locations, this.initialRoute.getWayPoints().toArray());
    console.group('MapContainer: ComponentDidUpdate');
    console.log(differ);
    console.groupEnd('MapContainer: ComponentDidUpdate');
    
    // Note: This check is preventing route update by App passing props
    // after a wayPoint was dragged (drag changes route already, no need to
    // repeat route rebuild)
    if (differ !== null) {
      this.updateRoute(locations);
    }

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
    const addressList = locations.map((location) => (
      // Build route by coords if specified, otherwise fallback to address
      location.coords.length !== 0 ? location.coords : location.value
    ));
    this.initialRoute.model.setReferencePoints(addressList);
  }

  handleRouteRequestSuccess(ymaps, e) {
    const wayPoints = this.initialRoute.getWayPoints().toArray();
    const diff = diffPoints(this.props.locations, wayPoints.slice(0));

    /* Debug */
      console.group('Route request success');
      console.count('Route updated (times)');
      console.log('Is first route request: ' + e.get('init'));
      console.log(wayPoints);
      console.log(diff);
      console.groupEnd('Route request success');
    /* #Debug */

    if (diff) {
      const { onWayPointDrag: updateLocationPoint } = this.props;
      updateLocationPoint(diff.index, diff.address);
    }

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

    this.initialRoute.model.events.add('requestsuccess', (event) => {
      this.handleRouteRequestSuccess(ymaps, event);
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
        <Map
          className="Map"
          modules={modules}  
          defaultState={mapDefaults}
          onLoad={this.handleLoad}
          instanceRef={ref => (this.map = ref)}
        >
        </Map>
      </div>
    );
  }
}
