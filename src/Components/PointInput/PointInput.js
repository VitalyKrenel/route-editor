import './PointInput.css';

import React from 'react';
import { Progress } from 'Components/Progress/Progress.js';

export default class PointInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { value } = this.state;

    this.setState({ loading: true });
    this.forceUpdate();

    try {
      await this.props.onSubmit(value);
    } catch (e) {
      console.log(e);
    }

    this.setState({ loading: false, value: '' });
  }

  render() {
    const isLoading = this.state.loading;

    return (
      <form className="App-Form PointInput-Form" onSubmit={this.handleSubmit}>
        <input
          className="PointInput-Field" type="text" value={this.state.value} 
          onChange={this.handleChange} placeholder="Введите адрес..."
        />  
        <Progress
          className="PointInput-Progress"
          width="16px"
          height="16px" 
          status={ isLoading ? Progress.LOADING : Progress.IDLE }
        />
      </form>
    );
  }
}
