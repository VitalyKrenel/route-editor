import './Progress.css';

import React from 'react';

export const Progress = (props) => {
  const { status, width, height, className } = props;

  const classList =
    `Progress ${Progress.getStatusClassName(status)} ${className}`;

  return (
    <div
      className={classList}
      style={{
        width,
        height,
      }}
    >
    </div>
  );
};

Progress.LOADING = 'loading';
Progress.IDLE = 'idle';
Progress.DONE = 'done';

Progress.getStatusClassName = (status) => {
  switch (status) {
    case 'done':
      return 'Progress_status_done';
    
    case 'loading': 
      return 'Progress_status_loading';
    
    default:
    case 'idle':
      return 'Progress_status_idle';  
  }
};
