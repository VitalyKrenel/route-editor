import React from 'react';
import { shallow, mount } from 'enzyme';

import App from './App.js';

jest.mock('./Components/MapContainer/MapContainer.js', () => {
  return () => (<div>MapContainer Component</div>);
});

describe('<App />', () => {

  it('renders without crashing', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toHaveLength(1);
  });

  it('adds a new location point to state', () => {
    const wrapper = shallow(<App />);
    const address = 'Москва, Красная площадь';
    
    wrapper.instance().addLocationPoint(address);

    expect(
      wrapper.state().locations
    ).toHaveLength(1);
  });

  it('passes new location points to PointList', () => {
    const wrapper = mount(<App />);
    const component = wrapper.instance();

    component.addLocationPoint('Москва, Красная площадь');
    component.addLocationPoint('Москва, Рижская станция');
    component.addLocationPoint('Москва, Белорусский вокзал');

    wrapper.find('PointList').update();
    
    expect(wrapper.find('PointListItem')).toHaveLength(3);
  });

  it('updates location point in the state with the specified index', () => {
    const wrapper = shallow(<App />);
    const component = wrapper.instance();
    const initialAddress = 'Москва, Красная Площадь';
    const updatedAddress = 'Москва, Планетарий';

    component.addLocationPoint(initialAddress);
    component.updateLocationPoint(0, updatedAddress);

    const [updatedLocationPoint] = wrapper.state().locations;

    expect(updatedLocationPoint.value).toBe(updatedAddress);
  });

  it('passes location points updates to PointList items', () => {
    const wrapper = mount(<App />);
    const pointList = wrapper.find('PointList');
    const component = wrapper.instance();
    const initialAddress = 'Москва, Красная Площадь';
    const updatedAddress = 'Москва, а вот и не Красная площадь';
    
    component.addLocationPoint(initialAddress);
    pointList.update();
    expect(wrapper.find('PointListItem').first().text()).toBe(initialAddress);

    component.updateLocationPoint(0, updatedAddress);
    pointList.update();
    expect(wrapper.find('PointListItem').first().text()).toBe(updatedAddress);
  });

  it('removes a location point from the state', () => {
    const wrapper = shallow(<App />);
    const component = wrapper.instance();

    component.setState({ locations: [
      { id: 0, value: undefined },
    ]});

    component.deleteLocationPoint(0);
    
    const { locations } = wrapper.state();

    expect(locations).toHaveLength(0);
  });

  it('removes a location point from PointList', () => {
    const wrapper = mount(<App />);
    const component = wrapper.instance();
    const pointList = wrapper.find('PointList');

    component.addLocationPoint('Москва');
    component.deleteLocationPoint(0);
    pointList.update();

    expect(wrapper.find('PointListItem')).toHaveLength(0);
  });

  it('moves a location point from one index to another in the state', () => {
    const wrapper = shallow(<App />);
    const component = wrapper.instance();
    const firstFakePoint = { id: 0, value: 'Москва' };
    const lastFakePoint = { id: 1, value: 'Санкт-Петербург' };

    component.setState({
      locations: [
        firstFakePoint,
        lastFakePoint,
      ],
    });

    const fromIndex = 0;
    const toIndex = 1;
    component.moveLocationPoint(fromIndex, toIndex);
    const [ firstPoint, lastPoint ] = wrapper.state().locations;

    expect(lastPoint.value).toBe(firstFakePoint.value);
    expect(firstPoint.value).toBe(lastFakePoint.value);
  });

  it('moves location points from one position to another inside PointList', () => {
    const wrapper = mount(<App />);
    const component = wrapper.instance();
    const pointList = wrapper.find('PointList');
    const firstAddress = 'Москва';
    const secondAddress = 'Санкт-Питербург';

    component.addLocationPoint(firstAddress);
    component.addLocationPoint(secondAddress);
    pointList.update();

    let items = wrapper.find('PointListItem');
    
    expect(items.first().text()).toBe(firstAddress);
    expect(items.last().text()).toBe(secondAddress);

    component.moveLocationPoint(0, 1);
    pointList.update();

    items = wrapper.find('PointListItem');

    expect(items).not.toHaveLength(0);
    expect(items.first().text()).toBe(secondAddress);
    expect(items.last().text()).toBe(firstAddress);
  });
});
