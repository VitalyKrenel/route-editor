import './App.css';

import React, { Component } from 'react';
import MapContainer from './MapContainer/MapContainer.js';
import PointInput from './PointInput/PointInput.js';

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
          <PointList />
        </div>
        <MapContainer />
      </main>
    );
  }
}


function PointList(props) {
  return (
    <ul className="App-List"></ul>
  );
}

export default App;
