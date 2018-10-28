import './MapContainer.css';

import React, { Component } from 'react';
import { Map as YandexMap, Placemark, Polyline } from 'react-yandex-maps';

YandexMap.displayName = 'Map';
Placemark.displayName = 'Placemark';
Polyline.displayName = 'Polyline';

const modules = [
  'geocode',
  'geoObject.addon.balloon',
];

const mapDefaults = { center: [55.75, 37.57], zoom: 12 };

export default class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.ymaps = null;

    this.state = {
      loaded: false,
    };

    this.handleLoad = this.handleLoad.bind(this);
  }

  componentDidMount() {
    this.props.onBoundsChange(mapDefaults.center);
  }

  handleLoad(ymaps) {
    const { onBoundsChange } = this.props;

    this.map.events.add('boundschange', (e) => {
      onBoundsChange(e.get('newCenter'));
    });

    this.setState({ loaded: true });
  }

  getPlacemark(locationPoint) {
    return (
      <Placemark
        properties={{
          balloonContentBody: locationPoint.value,
        }}
        options={{
          preset: 'islands#circleDotIcon',
          iconColor: '#FF270F',
        }}
        key={locationPoint.id}
        geometry={locationPoint.coords} 
      />
    );
  }

  render() {
    const { locations, className = '' } = this.props;
    const loadingModifier =
      (this.state.loaded ? '' : 'MapContainer_status_loading');

    return (
      <div
        className={`
          MapContainer
          App-MapContainer
          ${className}
          ${loadingModifier}
          MapContainer_size_fluid
          MapContainer_max-size_md
        `}
      >
        <YandexMap
          className="Map"
          modules={modules}
          defaultState={mapDefaults}
          onLoad={this.handleLoad}
          instanceRef={ref => (this.map = ref)}
        >
        { locations.map((location) => this.getPlacemark(location)) }
        <Polyline
          geometry={locations.map(loc => loc.coords)}
          options={{
            strokeColor: '#FF270F',
            strokeWidth: 4,
          }}
        />
        </YandexMap>
      </div>
    );
  }
}
