import './App.css';

import React, { Component } from 'react';
import MapContainer from './MapContainer/MapContainer.js';

class App extends Component {
  render() {
    return (
      <main className="App">
        <div className="App-Dashboard">
          <PointInput />
          <PointList />
        </div>
        <MapContainer />
      </main>
    );
  }
}

function PointInput(props) {
  return (
    <input className="App-Input" type="text"/>
  );
}

function PointList(props) {
  return (
    <ul className="App-List"></ul>
  );
}

export default App;
