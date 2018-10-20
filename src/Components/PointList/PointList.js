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
    const { droppableProps } = provided;

    const Item = provided ? DraggablePointListItem : PointListItem;

    const listItems =
      locations.map((location, index) => (
        <Item
          location={location}
          onDelete={onDelete}
          id={location.id}
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
        {provided.placeholder}
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

export class PointListItem extends React.Component {
  render() {
    const { location, onDelete } = this.props;
    const { provided, innerRef } = this.props;
    
    const { draggableProps, dragHandleProps } = provided;

    return (
      <li
        className="PointList-Item Item" 
        {...draggableProps}
        ref={innerRef}
      >
        <div
          className="Item-Icon" 
          {...dragHandleProps}
        ></div>
        <div className="Item-Location">{location.value}</div>
        <button
          className="Item-Button Item-Button_action_remove"
          onClick={() => onDelete(location.id)}
        ></button>
      </li>
    );
  }
}

function DraggablePointListItem(props) {
    const { id, index, ...rest } = props;

    return (
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <PointListItem provided={provided} placeholder={provided.placeholder} innerRef={provided.innerRef} {...rest} />
        )}
      </Draggable>
    );
}
