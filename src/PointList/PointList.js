import './PointList.css';

import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// PointList component is built with react-beautiful-dnd
// @see https://github.com/atlassian/react-beautiful-dnd
export default function PointList(props) {
  const { locations, onDelete } = props;

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    props.onDragEnd(sourceIndex, destIndex);
  };

  const listItems =
    locations.map((location, index) => (
      <PointListItem
        location={location}
        onDelete={onDelete}
        key={location.id}
        index={index}
      />
    ));

  // TODO: Add droppableId auto generation
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="PointList-1">
        {(provided) => (
          <ul 
            className="PointList"
            ref={provided.innerRef} 
            {...provided.droppableProps}
          >
            {listItems}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export function PointListItem(props) {
  const { value, id } = props.location;

  return (
    <Draggable draggableId={id} index={props.index}>
      {(provided) => (
        <li
          className="PointList-Item Item" 
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div 
            className="Item-Icon" 
            {...provided.dragHandleProps}
          ></div>
          <div className="Item-Location">{value}</div>
          <button 
            className="Item-Button Item-Button_action_remove"
            onClick={() => props.onDelete(id)}
          ></button>
        </li>
      )}
    </Draggable>
  ); 
}
