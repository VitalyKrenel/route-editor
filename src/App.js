import './App.css';

import React, { Component } from 'react';
import { withYMaps } from 'react-yandex-maps';
import MapContainer from './Components/MapContainer/MapContainer.js';
import PointInput from './Components/PointInput/PointInput.js';
import { DraggablePointList } from './Components/PointList/PointList.js';

import {
  addLocationPoint,
  deleteLocationPoint,
  moveLocationPoint,
  updateLocationPoint,
  makeLocationPointFactory,
} from './LocationPoint/LocationPoint.js';
import { isEmptyArray } from './Utils/Array.js'

const createLocationPoint = makeLocationPointFactory();

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
    };

    this.addLocationPoint = this.addLocationPoint.bind(this);
    this.deleteLocationPoint = this.deleteLocationPoint.bind(this);
    this.moveLocationPoint = this.moveLocationPoint.bind(this);
    this.updateLocationPoint = this.updateLocationPoint.bind(this);
  }

  fetch(requestValue) {
    const { geocode } = this.props.ymaps;
    return geocode(requestValue, { results: 1 });
  }

  fetchPointCoords(address) {
    return this.fetch(address).then(response => 
      response.geoObjects.get(0).geometry.getCoordinates()
    );
  }

  fetchPointAddress(coordinates) {
    return this.fetch(coordinates).then(response => 
      response.geoObjects.get(0).getAddressLine()
    );
  }

  addLocationPoint(value) {
    this.fetchPointCoords(value).then((coords) => {
      const locationPoint = createLocationPoint(value, coords);
  
      this.setState((state) => ({
        locations: addLocationPoint(state.locations, locationPoint),
      }));
    });
  }

  deleteLocationPoint(index) {
    this.setState((state) => ({
      locations: deleteLocationPoint(state.locations, index),
    }));
  }

  moveLocationPoint(from, to) {
    this.setState((state) => ({
      locations: moveLocationPoint(state.locations, from, to),
    }));
  }

  updateLocationPoint(index, coords) {
    this.fetchPointAddress(coords).then((address) => {
      const updateState = (state) => ({
        locations: updateLocationPoint(state.locations, index, {
          value: address,
          coords,
        }),
      });

      this.setState(updateState);
    });
  }

  render() {
    return (
      <main className="App">
        <div className="App-Dashboard">
          <PointInput onSubmit={this.addLocationPoint} />
          <DraggablePointList
            onDragEnd={this.moveLocationPoint}
            onDelete={this.deleteLocationPoint}
            locations={this.state.locations} />
        </div>
        <MapContainer
          locations={this.state.locations}
          onWayPointDrag={this.updateLocationPoint} 
        />
      </main>
    );
  }
}

export default withYMaps(App, true, ['geocode']);
