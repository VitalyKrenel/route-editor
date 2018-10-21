import './App.css';

import React, { Component } from 'react';
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

const createLocationPoint = makeLocationPointFactory();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [
        createLocationPoint('Москва, Новый Арбат'),
        createLocationPoint('Москва, Белорусский вокзал'),
        createLocationPoint('Москва, Рижский вокзал'),
      ],
    };

    this.addLocationPoint = this.addLocationPoint.bind(this);
    this.deleteLocationPoint = this.deleteLocationPoint.bind(this);
    this.moveLocationPoint = this.moveLocationPoint.bind(this);
    this.updateLocationPoint = this.updateLocationPoint.bind(this);
  }

  addLocationPoint(value) {
    const locationPoint = createLocationPoint(value);

    this.setState((state) => ({
      locations: addLocationPoint(state.locations, locationPoint),
    }));
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

  updateLocationPoint(index, address) {
    this.setState((state) => ({
      locations: updateLocationPoint(state.locations, index, address),
    }));
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

export default App;
