import React from 'react';
import { shallow, render } from 'enzyme';
import sinon from 'sinon';
import { YMaps } from 'react-yandex-maps';
import MapContainer from './MapContainer.js';
import { makeLocationPointFactory } from 'LocationPoint/LocationPoint.js';

const createLocationPoint = makeLocationPointFactory();
const sandbox = sinon.createSandbox();

describe('<MapContainer />', () => {  
  let wrapper;
  let component;
  let handleBoundsChange = sinon.fake();
  
  const locations = [
    createLocationPoint('Москва'),
    createLocationPoint('Китай'),
    createLocationPoint('Бразилия'),
  ];

  beforeEach(() => {
    sandbox.stub(MapContainer.prototype, 'getPlacemark');
    wrapper = shallow(
      <MapContainer
        locations={locations}
        onBoundsChange={handleBoundsChange}
      />
    );
    component = wrapper.instance();
  });

  afterEach(() => {
    sandbox.restore();
    handleBoundsChange.resetHistory();
  })

  it('renders without crashes', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('calls getPlacemark for each location point', () => {
    expect(component.getPlacemark.callCount).toBe(locations.length);
  });

  /**
   * 
   * - Adds a new PlaceMark on Map when new location point is added
   * - Updates Polyline geometry when new point is added
   * - 
   * 
   * 
   */
});
