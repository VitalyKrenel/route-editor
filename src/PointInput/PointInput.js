import React, { Component } from 'react';

export default class PointInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    const { value } = this.state;
    this.props.onSubmit(value);
    this.setState({ value: '' });
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input className="App-Input" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Введите адрес..." />
      </form>
    );
  }
}
