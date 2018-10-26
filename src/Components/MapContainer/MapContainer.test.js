import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import MapContainer from './MapContainer.js';
import { diffPoints } from 'Utils/Points.js';
import { makeLocationPointFactory } from 'LocationPoint/LocationPoint.js';

jest.mock('Utils/Points.js');

const createLocationPoint = makeLocationPointFactory();
const sandbox = sinon.createSandbox();

const getFakeInitialRoute = () => ({
  model: {
    events: {
      once: sinon.fake(),
      add: sinon.fake(),
    },
    setReferencePoints: sinon.fake(),
  },
  getWayPoints: sinon.fake(() => ({
    get() {
      return { 
        geometry: { getCoordinates: sinon.fake() }
      };
    },
    getLength: sinon.fake(),
    toArray: sinon.fake(() => []),
  })),
});

describe('<MapContainer />', () => {  
  let wrapper;
  let component;
  
  const locations = [
    createLocationPoint('Москва'),
    createLocationPoint('Китай'),
    createLocationPoint('Бразилия'),
  ];

  beforeEach(() => {
    wrapper = shallow(<MapContainer locations={locations} />);
    component = wrapper.instance();

    sandbox.stub(component, 'updateRoute');
    component.ymaps = true;
    component.initialRoute = getFakeInitialRoute();
  });

  afterEach(() => {
    sandbox.restore();
    delete component.ymaps;
    delete component.initialRoute;
  });

  it('calls updateRoute when recives props', () => {
    const locations = [createLocationPoint('Франция')];

    sandbox.assert.notCalled(component.updateRoute);
    wrapper.setProps({ locations });

    sandbox.assert.calledOnce(component.updateRoute);
  });

  it('calls updateRoute with correct arguments', () => {
    const locations = [createLocationPoint('Франция')];
    
    wrapper.setProps({ locations });

    sandbox.assert.calledWith(component.updateRoute, locations);
  });

  it('calls updateMapCenter after a new locationPoint was added', () => {
    const updatedLocations = locations.concat([
      createLocationPoint('Москва'),
    ]);
    const { initialRoute } = component;
    sandbox.stub(component, 'updateMapCenter');

    wrapper.setProps({ locations: updatedLocations });

    sandbox.assert.calledOnce(
      initialRoute.model.events.once
    );

    const shouldCallUpdateMap = initialRoute.model.events.once.args[0][1];
    shouldCallUpdateMap();
  
    sandbox.assert.calledOnce(component.updateMapCenter);
  });
});
