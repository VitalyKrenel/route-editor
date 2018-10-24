import './MapContainer.css';

import React, { Component } from 'react';
import { Map } from 'react-yandex-maps';

import { diffPoints } from 'Utils/MapPoints.js';

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
    if (!this.ymaps) { return; }

    const { locations } = this.props;

    /**
     * Note: Does not work as moveLocationPoint (drag&drop) is not considered
      const wayPointsArray = this.initialRoute.getWayPoints().toArray();
      // Note: This check is preventing the second route update 
      // if location point was updated by MapContainer component
      const shouldUpdateRoute = 
        locations.length !== wayPointsArray.length ||
        diffPoints(locations, wayPointsArray) !== null;
     */
    this.updateRoute(locations);

    if (locations.length > prevProps.locations.length) {
      // Set map center if a new point was added when route is done updating
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
    const { locations } = this.props;

    let diff;

    // Note: diffPoints is an expensive operation, ensure we need it
    // if lengths are not equal then route was definitely updated through
    // add or delete methods hence it was not a map interaction.
    if (wayPoints.length === locations.length) { 
      diff = diffPoints(this.props.locations, wayPoints.slice(0));
    }

    /* Debug */
      console.group('Route request success');
      console.count('Route updated (times)');
      console.log('Is first route request: ' + e.get('init'));
      console.log(wayPoints);
      console.log(diff);
      console.groupEnd('Route request success');
    /* #Debug */

    // RouteSuccess event was fired because of the user interaction with map
    // (i.e. way points drag&drop discovered) - requires App.state.locations
    // update for synching
    if (diff) {
      const { onWayPointDrag: updateLocationPoint } = this.props;
      updateLocationPoint(diff.index, { coords: diff.coords });
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
        // reverseGeocoding: true,
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
        className="
          MapContainer
          MapContainer_size_fluid
          MapContainer_max-size_md
          MapContainer_status_loading"
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
