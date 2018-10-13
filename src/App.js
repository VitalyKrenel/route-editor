import './App.css';

import React, { Component } from 'react';
import MapContainer from './MapContainer/MapContainer.js';
import PointInput from './PointInput/PointInput.js';
import PointList from './PointList/PointList.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
    };
    this.addLocationPoint = this.addLocationPoint.bind(this);
  }

  addLocationPoint(value) {
    const locations = this.state.locations.slice(0);
    const newLocationPoint = value;
    console.log(value);
    this.setState({ locations: locations.concat(newLocationPoint) });
  }

  render() {
    return (
      <main className="App">
        <div className="App-Dashboard">
          <PointInput onSubmit={this.addLocationPoint} />
          <PointList locations={this.state.locations} />
        </div>
        <MapContainer />
      </main>
    );
  }
}

export default App;
