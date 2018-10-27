import React from 'react';
import { shallow } from 'enzyme';
import { Progress } from './Progress.js';

describe('<Progress />', () => {
  describe('rendering', () => {
    it('renders the component without crashes', () => {
      const wrapper = shallow(<Progress />);
      expect(wrapper).toHaveLength(1);
    });

    it('should have a div representing progress', () => {
      const wrapper = shallow(<Progress />);

      expect(
        wrapper.find('div').exists()
      ).toBe(true);
    });

    it('should set className based on given status prop', () => {
      const status = Progress.LOADING;
      const wrapper = shallow(<Progress status={status} />);
      const loadingClass = Progress.getStatusClassName(status);
      
      expect(
        wrapper.find('div').hasClass(loadingClass)
      ).toBe(true);
    });

    it('should set default className if no status prop is given', () => {
      const wrapper = shallow(<Progress />);
      const defaultClass = Progress.getStatusClassName();
      
      expect(
        wrapper.find('div').hasClass(defaultClass)
      ).toBe(true);
    });

    it('sets width from props correctly', () => {
      const width = '32px';
      const wrapper = shallow(<Progress width={width} />);

      expect(wrapper.find('div').prop('style').width).toBe(width);
    })

    it('sets height from props correctly', () => {
      const height = '16px';
      const wrapper = shallow(<Progress height={height} />);

      expect(wrapper.find('div').prop('style').height).toBe(height);
    });

    it('add className props to inner className property correctly', () => {
      const className = 'PointInput-Progress';
      const wrapper = shallow(
        <Progress className={className}/>
      );

      expect(
        wrapper.find('div').hasClass(className)
      ).toBe(true);
    });
  });
  
  describe('getStatusClassName()', () => {
    it.each([
      ['Progress_status_idle', 'idle'],
      ['Progress_status_loading', 'loading'],
      ['Progress_status_done', 'done'],
    ])('returns css class %s when status is %s', (expectedClass, status) => {
      expect(Progress.getStatusClassName(status)).toBe(expectedClass);
    });

    it('returns a default idle class when no status is ommited', () => {
      expect(Progress.getStatusClassName()).toBe('Progress_status_idle');
    })
  });
});
