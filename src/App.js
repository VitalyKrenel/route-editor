import './App.css';

import React, { Component } from 'react';
import MapContainer from './MapContainer/MapContainer.js';
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
    this.deleteLocationPoint = this.deleteLocationPoint.bind(this);
    this.moveLocationPoint = this.moveLocationPoint.bind(this);
  }

  addLocationPoint(value) {
    const locations = this.state.locations.slice(0);
    const newLocationPoint = { 
      value,
      id: generateId(),
    };
    
    console.log(newLocationPoint);
    
    this.setState({ locations: locations.concat(newLocationPoint) });
  }

  deleteLocationPoint(id) {
    const locations = this.state.locations.slice(0).filter((location) => {
      return location.id !== id; 
    });
    
    this.setState({ locations });
  }

  moveLocationPoint(from, to) {
    const locations = this.state.locations.slice(0);
    const extractedPoint = locations.splice(from, 1)[0];
    locations.splice(to, 0, extractedPoint);

    // console.log(locations);
    // console.log(this.state.locations);

    this.setState(state => ({ locations }));
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
        <MapContainer locations={this.state.locations} />
      </main>
    );
  }
}

export default App;
