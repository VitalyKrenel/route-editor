import './App.css';

import React, { Component } from 'react';
import MapContainer from './Components/MapContainer/MapContainer.js';
import PointInput from './Components/PointInput/PointInput.js';
import PointList from './Components/PointList/PointList.js';

import {
  addLocationPoint,
  deleteLocationPoint,
  moveLocationPoint,
  updateLocationPoint,
} from './LocationPoint/LocationPoint.js';

const generateId = () => {
  // Note: Keys are not determenistic and are calculated at the rendering time
  // DEVELOPMENT ONLY
  return `id_${new Date().getTime()}`;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [
        { value: 'Москва, Новый Арбат', id: 0 },
        { value: 'Москва, Белорусский вокзал', id: 1 },
        { value: 'Москва, Рижский вокзал', id: 2 },
      ],
    };

    this.addLocationPoint = this.addLocationPoint.bind(this);
    this.deleteLocationPoint = this.deleteLocationPoint.bind(this);
    this.moveLocationPoint = this.moveLocationPoint.bind(this);
    this.updateLocationPoint = this.updateLocationPoint.bind(this);
  }

  addLocationPoint(value) {
    this.setState((state) => ({
      locations: addLocationPoint(state.locations, value),
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
          <PointList
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
