import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <main className="App">
        <div className="App-Dashboard">
          <PointInput />
          <PointList />
        </div> 
        <Map />
      </main>
    );
  }
}

function Map(props) {
  return (
    <div className="App-Map" id="map"></div>
  );
}

function PointInput (props) {
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
