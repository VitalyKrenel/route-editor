import './ScreenToggler.css';

import React from 'react';

export class ScreenToggler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      label: ''
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    const { initialLabel: label } = this.props;

    this.setState((state) => ({ label }));
  }

  handleToggle() {
    const { onToggle, initialLabel, toggledLabel } = this.props;

    this.setState((state) => ({
      label: state.label === initialLabel ? toggledLabel : initialLabel,
    }));

    onToggle();
  }
  
  render() {
    const { label } = this.state;

    return (
      <button 
        className="ScreenToggler App-ScreenToggler" 
        onClick={this.handleToggle}
      >
        {label}
      </button>
    );
  }
}
