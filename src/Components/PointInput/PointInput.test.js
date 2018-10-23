import React from 'react';
import { shallow } from 'enzyme';

import PointInput from './PointInput.js';

describe('<PointInput />', () => {
  const eventMock = { preventDefault() {} };
  let wrapper;
  let input;
  let onSubmit;
  let form;

  beforeEach(() => {
    onSubmit = jest.fn();
    wrapper = shallow(<PointInput onSubmit={onSubmit}/>);
    input = wrapper.find('input');
    form = wrapper.find('form');
  });

  it('calls onSubmit handler', () => {
    form.simulate('submit', eventMock);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('passes value property to onSubmit handler', () => {
    const address = 'Москва, Новый Арбат';
    input.simulate('change', {
      target: { value: address },
    });
    form.simulate('submit', eventMock);
    
    expect(onSubmit).toHaveBeenCalledWith(address);
  });

  it('clears input field after submit', () => {
    input.simulate('change', {
      target: { value: 'Сахалинская область' },
    });
    form.simulate('submit', eventMock);
  
    expect(input.prop('value')).toBe('');
  });
});
