import './App.css';

import React, { Component } from 'react';
import { withYMaps } from 'react-yandex-maps';
import MapContainer from './Components/MapContainer/MapContainer.js';
import PointInput from './Components/PointInput/PointInput.js';
import { DraggablePointList } from './Components/PointList/PointList.js';
import { ScreenToggler } from './Components/ScreenToggler/ScreenToggler.js';

import {
  addLocationPoint,
  deleteLocationPoint,
  moveLocationPoint,
  updateLocationPoint,
  makeLocationPointFactory,
} from './LocationPoint/LocationPoint.js';
import { notEmptyArray } from './Utils/Array.js'

export const viewList = ['App-PointList', 'App-MapContainer'];
const shouldBeHidden = (view, activeView) => (
  view !== activeView ? 'is-hidden' : ''
);

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      activeView: viewList[0],
    };

    this.mapCenter = [];

    this.createLocationPoint = makeLocationPointFactory();

    this.toggleView = this.toggleView.bind(this);
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

  toggleView() {
    const nextView = (view) => (
      view === viewList[0] ? viewList[1] : viewList[0]
    );

    this.setState((state) => ({
      activeView: nextView(state.activeView),
    }));
  }

  async addLocationPoint(value) {
    // const coords = await this.fetchPointCoords(value);
    const locationPoint = this.createLocationPoint(value, this.mapCenter);

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

  deleteLocationPoint(id) {
    this.setState((state) => ({
      locations: deleteLocationPoint(state.locations, id),
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
    const { activeView } = this.state; 

    return (
      <main className="App">
        <div className="
          App-InnerContainer
          App-InnerContainer_row
          App-InnerContainer_fluid
        ">
          <div className={`
            App-Dashboard
            ${shouldBeHidden(viewList[0], activeView)}
          `}>
            <PointInput onSubmit={this.addLocationPoint} />
            <DraggablePointList
              onDragEnd={this.moveLocationPoint}
              onDelete={this.deleteLocationPoint}
              locations={this.state.locations} />
          </div>
          <MapContainer
            onBoundsChange={(coords) => { this.mapCenter = coords; }}
            className={shouldBeHidden(viewList[1], activeView)}
            locations={this.state.locations}
            onPlacemarkDragEnd={this.updateLocationPoint} 
          />     
        </div>
        <ScreenToggler
          onToggle={this.toggleView}
          initialLabel="Показать карту"
          toggledLabel="Показать список точек"
        />
      </main>
    );
  }
}

export default withYMaps(App, true, ['geocode']);
