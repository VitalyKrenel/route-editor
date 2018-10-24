import React from 'react';
import sinon from 'sinon';
import { shallow } from "enzyme";

import { ScreenToggler } from "./ScreenToggler";

describe('<ScreenToggler />', () => {
  describe('rendering', () => {
    it('should render component without crashes', () => {
      const wrapper = shallow(<ScreenToggler />);
      expect(wrapper).toHaveLength(1);
    });

    it('should render component with a given initial label', () => {
      const label = 'Показать карту';
      const wrapper = shallow(<ScreenToggler initialLabel={label} />);
      expect(wrapper.text()).toBe(label);
    });
  });

  describe('interaction', () => {
    it('should trigger handleToggle function when toggler is clicked', () => {
      const handleToggle = sinon.fake();
      const wrapper = shallow(<ScreenToggler onToggle={handleToggle} />);

      wrapper.find('button').simulate('click');

      expect(handleToggle.called).toBe(true);
    });

    it('should change label on to toggledLabel click', () => {
      const handleToggle = sinon.fake();
      const toggledLabel = 'Показать список точек';
      const wrapper = shallow(<ScreenToggler onToggle={handleToggle} initialLabel='Показать карту' toggledLabel={toggledLabel} />);

      wrapper.find('button').simulate('click');

      expect(wrapper.text()).toBe(toggledLabel);
    });
  });
});
