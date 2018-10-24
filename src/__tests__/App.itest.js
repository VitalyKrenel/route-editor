import React from 'react';
import { mount } from 'enzyme'; 
import sinon from 'sinon';

import { App } from 'App.js';

jest.mock('Components/MapContainer/MapContainer.js', () => {
  return () => (<div>MapContainer Component</div>);
});

describe('App and PointList cooperation', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(App.prototype, "fetchPointAddress").resolves('Москва');
    sandbox.stub(App.prototype, "fetchPointCoords").resolves([55, 38]);
  });

  afterEach(() => {
    sandbox.restore();
  })

  it('should render items added to state inside PointList', async () => {
    expect.assertions(1);

    const wrapper = mount(<App />);
    const component = wrapper.instance();

    await component.addLocationPoint('Москва, Красная площадь');
    await component.addLocationPoint('Москва, Рижская станция');
    await component.addLocationPoint('Москва, Белорусский вокзал');
    wrapper.update();
    
    expect(wrapper.find('PointListItem')).toHaveLength(3);
  });

  it('should delete a location point from PointList', async () => {
    const wrapper = mount(<App />);
    const component = wrapper.instance();

    const point = await component.addLocationPoint('Москва');
    wrapper.update();
    component.deleteLocationPoint(point.id);
    wrapper.update();

    expect(wrapper.find('PointListItem')).toHaveLength(0);
  });

    it('moves location points from one position to another inside PointList', async () => {
    expect.assertions(5);

    const wrapper = mount(<App />);
    const component = wrapper.instance();
    const pointList = wrapper.find('PointList');
    const firstAddress = 'Москва';
    const secondAddress = 'Санкт-Питербург';

    await component.addLocationPoint(firstAddress);
    await component.addLocationPoint(secondAddress);
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

  it('should delete a location point if all points had been removed and the point was added after that', async () => {
    let wrapper = mount(<App />);
    let deleteItemButton;
    const component = wrapper.instance();
    
    await component.addLocationPoint('Москва, Новый Арбат');
    wrapper.update();

    deleteItemButton = wrapper.find('PointListItem').find('button');
    deleteItemButton.simulate('click');
    wrapper.update();

    expect(wrapper.find('PointListItem')).toHaveLength(0);

    await component.addLocationPoint('Москва, Белорусский вокзал');
    wrapper.update();

    deleteItemButton = wrapper.find('PointListItem').find('button');
    deleteItemButton.simulate('click');
    wrapper.update();

    expect(wrapper.find('PointListItem')).toHaveLength(0);
  });
});
