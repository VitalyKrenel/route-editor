import './PointList.css';

import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// PointList component is built with react-beautiful-dnd
// @see https://github.com/atlassian/react-beautiful-dnd
export class PointList extends React.Component {
  render() {
    const { locations, onDelete } = this.props;
    // Props provided from Draggable
    const { provided, innerRef} = this.props;
    const { droppableProps, placeholder } = provided;

    const listItems =
      locations.map((location, index) => (
        <PointListItem
          location={location}
          onDelete={onDelete}
          key={location.id}
          index={index}
        />
      ));

    // Note: If PointList is wrapped in Droppable then it will be a drop place,
    // otherwise it will be an normal list with items. 
    return (
      <ul
        className="PointList"
        ref={innerRef}
        { ...droppableProps }
      >
        {listItems}
        {placeholder}
      </ul>
    );
  }
}

export function DraggablePointList(props) {
  const { onDragEnd, ...rest } = props;

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    onDragEnd(sourceIndex, destIndex);
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="PointList-1">
        {provided => (
          <PointList
            provided={provided}
            innerRef={provided.innerRef}
            { ...rest }
          />
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
