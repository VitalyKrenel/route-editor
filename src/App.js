import './App.css';

import React, { Component } from 'react';
import MapContainer, { generateGeometry } from './MapContainer/MapContainer.js';
import PointInput from './PointInput/PointInput.js';
import PointList from './PointList/PointList.js';

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
        { value: 'Москва, Новый Арбат', id: generateId() + 1},
        { value: 'Москва, Белорусский вокзал', id: generateId() + 2 },
        { value: 'Москва, Рижский вокзал', id: generateId() + 3 },

      ],
    };
    this.addLocationPoint = this.addLocationPoint.bind(this);
  }

  addLocationPoint(value) {
    const locations = this.state.locations.slice(0);
    const newLocationPoint = { 
      value,
      id: generateId(),
      geometry: generateGeometry(),
    };
    
    console.log(newLocationPoint);
    
    this.setState({ locations: locations.concat(newLocationPoint) });
  }

  render() {
    return (
      <main className="App">
        <div className="App-Dashboard">
          <PointInput onSubmit={this.addLocationPoint} />
          <PointList locations={this.state.locations} />
        </div>
        <MapContainer locations={this.state.locations} />
      </main>
    );
  }
}

export default App;
