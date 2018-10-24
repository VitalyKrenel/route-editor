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
    const { droppableProps } = (provided || {});

    const items = this.props.children ||
      locations.map((location) => (
        <PointListItem
          location={location}
          onDelete={onDelete}
          key={location.id}
        />
      ));

    return (
      <ul
        className="PointList App-PointList"
        ref={innerRef}
        { ...droppableProps }
      >
        {items}
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
          >
            {rest.locations.map((location, index) => (
              <DraggablePointListItem
                // Draggable props
                id={location.id}
                index={index}

                location={location}
                onDelete={rest.onDelete}
                key={location.id}
              />
            ))}
            {provided.placeholder}
          </PointList>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export class PointListItem extends React.Component {
  render() {
    const { location, onDelete } = this.props;
    const { provided, innerRef } = this.props;
    
    const { draggableProps, dragHandleProps } = (provided || {});

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
