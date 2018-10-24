import React from 'react';
import { PointList, PointListItem } from './PointList.js';
import { makeLocationPointFactory } from 'LocationPoint/LocationPoint.js';

import { shallow, mount } from 'enzyme';

const createLocationPoint = makeLocationPointFactory();

describe('<PointList />', () => {
  it('contains the same number of items as the provided locations array', () => {
    const locations = [
      createLocationPoint('Москва, Новый Арбат'),
      createLocationPoint('Москва, ВДНХ'),
      createLocationPoint('Москва, Белорусский вокзал'),
    ];
    const wrapper = 
      shallow(<PointList locations={locations} />);

    expect(
      wrapper.find(PointListItem)
    ).toHaveLength(locations.length);
  });

  it('contains no elements when the provided locations array is empty', () => {
    const locations = [];
    const wrapper = shallow(<PointList locations={locations} />);

    expect(
      wrapper.find(PointListItem)
    ).toHaveLength(0);
  });

  it('passes onDelete prop to child components (list items)', () => {
    const locations = [createLocationPoint('Москва')];
    const onDelete = jest.fn();
    const wrapper = shallow(<PointList locations={locations} onDelete={onDelete}/>);
    
    expect(
      wrapper.find(PointListItem).first().prop('onDelete')
    ).toEqual(onDelete);
  });

  it('should trigger onDelete function when the item\'s delete button is clicked', () => {
    const handleDelete = jest.fn();
    const locations = [
      createLocationPoint('Москва, Новый Арбат')
    ];

    const wrapper = mount(<PointList locations={locations} onDelete={handleDelete} />);
    
    const itemWrapper = wrapper.find(PointListItem);
    itemWrapper.find('button').simulate('click');

    expect(handleDelete).toHaveBeenCalled();
  });

  it('renders children passed into component correctly', () => {
    const locations = [
      createLocationPoint('Москва, Новый Арбат'),
      createLocationPoint('Москва, Арбат'),
    ];

    const items = locations.map((location, i) => (
      <PointListItem location={location} key={i}/>
    ));

    const wrapper = shallow(
      <PointList>
        {items}
      </PointList>
    );

    expect(
      wrapper.containsAllMatchingElements(items)
    ).toBe(true);
  });


});
