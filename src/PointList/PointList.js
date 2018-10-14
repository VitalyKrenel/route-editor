import './PointList.css';

import React from 'react';

export default function PointList(props) {
  const { locations } = props;

  const listItems =
    locations.map((location) => (
      <PointListItem 
        location={location.value} 
        key={location.id} 
      />
    ));

  return (
    <ul className="PointList">
      {listItems}
    </ul>
  );
}

export function PointListItem(props) {
  const { location } = props;

  return (
    <li className="PointList-Item Item">
      <div className="Item-Location">{location}</div>
      <button className="Item-Button Item-Button_action_remove">×</button>
    </li>
  ); 
}
