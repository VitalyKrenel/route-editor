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
import { notEmptyArray } from './Utils/Array.js'

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

  async addLocationPoint(value) {
    const coords = await this.fetchPointCoords(value);
    const locationPoint = createLocationPoint(value, coords);

    const updateState = (state) => ({
      locations: addLocationPoint(state.locations, locationPoint),
    });

    return new Promise((resolve, reject) => {
      try {
        this.setState(updateState, () => {
          resolve(locationPoint);
        });
      } catch (e) {
        reject(e);
      }
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

  async updateLocationPoint(index, update) {
    const updateState = (state) => ({
      locations: updateLocationPoint(state.locations, index, update),
    });

    if (notEmptyArray(update.coords)) {
      // Fetch a corresponding address
      update.value = await this.fetchPointAddress(update.coords); 
    } else if (update.value) {
      // Fetch a corresponding coordinates
      update.coords = await this.fetchPointCoords(update.value);
    }

    // Return a new promise that will be resolved only after
    // the state is updated
    return new Promise((resolve, reject) => {
      try {
        this.setState(updateState, () => {
          resolve(update);
        });
      } catch (e) {
        reject(e);
      }
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
