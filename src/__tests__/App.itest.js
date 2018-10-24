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
