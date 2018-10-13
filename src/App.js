import './App.css';

import React, { Component } from 'react';
import MapContainer from './MapContainer/MapContainer.js';
import PointInput from './PointInput/PointInput.js';
import PointList from './PointList/PointList.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      points: [],
    };
    this.addPoint = this.addPoint.bind(this);
  }

  addPoint(value) {
    const points = this.state.points.slice(0);
    const newPoint = value;
    console.log(value);
    this.setState({ points: points.concat(newPoint) });
  }

  render() {
    return (
      <main className="App">
        <div className="App-Dashboard">
          <PointInput onSubmit={this.addPoint} />
          <PointList locations={this.state.points} />
        </div>
        <MapContainer />
      </main>
    );
  }
}

export default App;
