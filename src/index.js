import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { YMaps } from "react-yandex-maps";
import App from './App.js';

const apikey = '262287d2-a40d-4b35-b808-7d4231cb5915';

ReactDOM.render(
  <YMaps query={{ apikey }}>
    <App />
  </YMaps>, 
  document.getElementById('root')
);
