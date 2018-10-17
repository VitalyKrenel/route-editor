import './MapContainer.css';

import React, { Component } from 'react';
import { YMaps, Map } from 'react-yandex-maps';
import { diffPoints } from './MapPointsUtils/MapPointsUtils.js';

const apikey = '262287d2-a40d-4b35-b808-7d4231cb5915';
const modules = [
  'multiRouter.MultiRoute',
  'geocode',
  'geoObject.addon.balloon',
  'templateLayoutFactory',
];

const mapDefaults = { center: [55.75, 37.57], zoom: 12 };

export default class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapIsLoaded: false,
    };

    this.handleLoad = this.handleLoad.bind(this);
    this.updateMapCenter = this.updateMapCenter.bind(this);
    this.syncWayAndLocationPoints = this.syncWayAndLocationPoints.bind(this);
  }

  updateMapCenter(wayPointsArray) {
    const { locations } = this.props;
    const lastLocPoint = locations[locations.length - 1];
    
    // Note: For the case when API has loaded but no location points avaliable
    if (lastLocPoint === undefined) {
      return;
    }

    /*
     * Note: multiRoute referencePoints are stored unorderedly (my guess),
     * because the last element (returned by .get() method) doesn't match
     * last in locations array.
     * To find the real last point I filter all points by comparing 
     * last locationPoint.value (address) with all wayPoints.
     */
    const lastWayPoint = wayPointsArray.filter((wayPoint) => 
      lastLocPoint.value === wayPoint.properties.get('request')
    ).pop();

    if (lastWayPoint) {
      // Duration param adds transition between prev and new centers
      this.map.setCenter(lastWayPoint.geometry.getCoordinates(), 
        mapDefaults.zoom, {
        duration: 500,
      });
    }
  }

  /**
   * Finds location point that is out of sync with route's wayPoints on Map 
   * and calls the onWayPointDrag handler (passed through props ) with point 
   * index and new address.
   * 
   * @param {Array} wayPointsArray 
   */
  syncWayAndLocationPoints(wayPointsArray) {
    const { locations } = this.props;
    // Note: Rename for readability
    const { onWayPointDrag: updateLocationPoint } = this.props;

    if (wayPointsArray.length === 0) {
      return;
    }

    const locPointNeedsUpdate = diffPoints(locations, wayPointsArray);
    if (!locPointNeedsUpdate) { 
      return;
    }
    
    const { index, coords } = locPointNeedsUpdate;

    // Fetch address with geocode module because wayPoint have only coords
    this.ymaps.geocode(coords, {
      results: 1,
    }).then((response) => {
      const address = response.geoObjects.get(0).properties.get('text');
      return address;
    }).then((address) => {
      updateLocationPoint(index, address);
    });
  }

  handleLoad(ymaps) {
    this.ymaps = ymaps;

    const initialRoute = new ymaps.multiRouter.MultiRoute({
      referencePoints: this.props.locations.map((loc) => loc.value),
      params: {
        // Limit routes number to 1, otherwise additional routes are shown
        results: 1,
      }
    }, {
      wayPointDraggable: true,
      preventDragUpdate: true,
      // Force route to keep the same color even when being inactive
      routeStrokeColor: '#a051cf',
      routeActiveStrokeColor: '#a051cf',
      routeOpacity: 1,
      // Stop opening balloon on route click (wayPoints handled separately)
      routeOpenBalloonOnClick: false,
      wayPointBalloonContentLayout: ymaps.templateLayoutFactory.createClass(
            '{{ properties.address|raw }}'), 
    });

    initialRoute.model.events.add('requestsuccess', () => {      
      const wayPoints = initialRoute.getWayPoints().toArray();
      
      /** 
       * Note: This eliminates the neccessity of creating own balloon layout,
       * but I didn't find a way to attach this addon directly to route, so
       * I wouldn't have to handle this manually each time wayPoints 
       * get updated.
       * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geoObject.addon.balloon-docpage/ 
       */
      // Add Yandex Balloon for every wayPoint when points get updated
      wayPoints.forEach((wayPoint) => {
        ymaps.geoObject.addon.balloon.get(wayPoint);
      });

      this.updateMapCenter(wayPoints);
      this.syncWayAndLocationPoints(wayPoints);
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
    const loadingStatus = mapIsLoaded ? '' : ' MapContainer_status_loading';

    const { locations } = this.props;

    if (this.ymaps) {
      this.updateRoute(locations);
    }

    return (
      <div className={"MapContainer MapContainer_size_fluid App-MapContainer" + loadingStatus}>
        <YMaps query={{apikey}}>
          <Map
            className="Map App-Map"
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
