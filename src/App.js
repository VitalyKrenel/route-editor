import './App.css';

import React, { Component } from 'react';
import MapContainer from './MapContainer/MapContainer.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      points: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const points = this.state.points.slice(0);
      const newPoint = e.target.value;

      this.setState({ points: points.concat(newPoint) });
    }
  }

  render() {
    return (
      <main className="App">
        <div className="App-Dashboard">
          <PointInput onKeyPress={this.handleSubmit} />
          <PointList />
        </div>
        <MapContainer />
      </main>
    );
  }
}

function PointInput(props) {
  return (
    <input className="App-Input" type="text" {...props}/>
  );
}

function PointList(props) {
  return (
    <ul className="App-List"></ul>
  );
}

export default App;
