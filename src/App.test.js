import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { App, viewList } from './App.js';
// import * as ReactYandexMaps from 'react-yandex-maps';

// jest.mock('react-yandex-maps', () => () => ({
//   withYMaps: (elem) => elem,
// }));

// ReactYandexMaps.withYMaps = jest.fn((elem) => {
//   const Elem = elem;
//   return <Elem />;
// });

jest.mock('./Components/MapContainer/MapContainer.js', () => {
  return () => (<div>MapContainer Component</div>);
});


describe('<App />', () => {
  let sandbox = sinon.createSandbox();

  const fakeYmaps = {
    geocode: sinon.stub().resolves(),
  };

  beforeEach(() => {
    sandbox.stub(App.prototype, "fetchPointAddress").resolves('Москва');
    sandbox.stub(App.prototype, "fetchPointCoords").resolves([55, 38]);

    fakeYmaps.geocode.resetHistory();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<App ymaps={fakeYmaps} />);
    expect(wrapper).toHaveLength(1);
  });

  it('toggles view correctly', () => {
    const wrapper = shallow(<App />); 
    
    wrapper.instance().toggleView();

    expect(wrapper.state().activeView).toBe(viewList[1]);
  });

  it('comes back to initial view if toggled twice', () => {
    const wrapper = shallow(<App />); 
    
    wrapper.instance().toggleView();
    wrapper.instance().toggleView();

    expect(wrapper.state().activeView).toBe(viewList[0]);
  });

  it('adds a new location point to state', async () => {
    expect.assertions(1);

    const wrapper = mount(<App ymaps={fakeYmaps} />);
    const component = wrapper.instance();
    const address = 'Москва, Красная площадь';

    /**
     * How does await know that the operation (state update after 
     * fetching coordinates) is finished if addLocationPoint 
     * returns undefined ?
     * Explanation: https://stackoverflow.com/a/47022453/9575622 
     */
    await component.addLocationPoint(address);

    expect(wrapper.state().locations).toHaveLength(1);
  });

  it('correctly sets a new point address', async () => {
    expect.assertions(1);

    const wrapper = mount(<App ymaps={fakeYmaps} />);
    const component = wrapper.instance();
    const address = 'Москва, Красная площадь';

    await component.addLocationPoint(address);

    const locationPoint = wrapper.state().locations[0];
    expect(locationPoint.value).toBe(address);
  });

  it('updates location point in the state with the specified index', async () => {
    expect.assertions(1);

    const wrapper = shallow(<App />);
    const component = wrapper.instance();
    const initialAddress = 'Москва, Красная Площадь';
    const updatedAddress = 'Москва, Планетарий';

    await component.addLocationPoint(initialAddress);
    await component.updateLocationPoint(0, { value: updatedAddress });

    const [updatedLocationPoint] = wrapper.state().locations;

    expect(updatedLocationPoint.value).toBe(updatedAddress);
  });

  it('passes location points updates to PointList items', async () => {
    expect.assertions(2);
    const wrapper = mount(<App />);
    const pointList = wrapper.find('PointList');
    const component = wrapper.instance();
    const initialAddress = 'Москва, Красная Площадь';
    const updatedAddress = 'Москва, а вот и не Красная площадь';
    
    await component.addLocationPoint(initialAddress);
    pointList.update();
    expect(wrapper.find('PointListItem').first().text()).toBe(initialAddress);

    await component.updateLocationPoint(0, { value: updatedAddress });
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

  it('delete a location point with the given id', async () => {
    const wrapper = shallow(<App />);
    const component = wrapper.instance();
    const deleteAddress = 'Москва, Библио-Глобус';

    await component.addLocationPoint('Москва, Новый Арбат');
    await component.addLocationPoint('Москва, Рижская станция');
    const shouldDelete = await component.addLocationPoint(deleteAddress);
    await component.addLocationPoint('Москва, Арбат');

    component.deleteLocationPoint(shouldDelete.id);

    expect(wrapper.state().locations).not.toContain(shouldDelete);
  });

  it('delete duplicated location points', async () => {
    const wrapper = shallow(<App />);
    const component = wrapper.instance();

    const shouldDelete = [];

    shouldDelete[0] = await component.addLocationPoint('Москва, Новый Арбат');
    shouldDelete[1] = await component.addLocationPoint('Москва, Новый Арбат');

    component.deleteLocationPoint(shouldDelete[0].id);
    component.deleteLocationPoint(shouldDelete[1].id);

    expect(wrapper.state().locations).toHaveLength(0);
  });
});
