import './PointList.css';

import React from 'react';

export default function PointList(props) {
  const { locations, onDelete } = props;

  const listItems =
    locations.map((location) => (
      <PointListItem
        location={location}
        onDelete={onDelete}
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
  const { value, id } = props.location;

  return (
    <li className="PointList-Item Item">
      <div className="Item-Icon"></div>
      <div className="Item-Location">{value}</div>
      <button 
        className="Item-Button Item-Button_action_remove"
        onClick={() => props.onDelete(id)}
      ></button>
    </li>
  ); 
}
