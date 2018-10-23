import sinon from 'sinon';

import { diffPoints } from './MapPoints.js';

const getFakeWayPoint = (coords = [99, 99], request = 'fake_request') => ({
  properties: {
    get: sinon.stub()
      .withArgs('address').returns('fake_address')
      .withArgs('request').returns(request)
  },
  geometry: {
    getCoordinates: sinon.stub().returns(coords),
  },
});

const getFakeLocationPoint = (id, coords, value) => ({
  id,
  coords,
  value
});

describe('diffPoints()', () => {
  it('returns a diff object when one location point has not matching way point', () => {
    const updatedCoords = [99, 99];
    const wayPoints = [
      getFakeWayPoint([15, 16]),
      getFakeWayPoint(updatedCoords),
    ];

    const locations = [
      getFakeLocationPoint(0, [15, 16], 'Питер'),
      getFakeLocationPoint(0, [21, 22], 'Москва'),
    ];

    const diff = diffPoints(locations, wayPoints);

    expect(diff.index).toBe(1);
    expect(diff.coords).toEqual(updatedCoords);
  });

  it('returns a diff object representing the first unmatching points pair', () => {
    const firstlyUpdatedCoords = [20, 20]; 
    const wayPoints = [
      getFakeWayPoint(firstlyUpdatedCoords),
      getFakeWayPoint([30, 30]),
    ];

    const locations = [
      getFakeLocationPoint(0, [15, 16], 'Питер'),
      getFakeLocationPoint(0, [21, 22], 'Москва'),
    ];

    const diff = diffPoints(locations, wayPoints);

    expect(diff.index).toBe(0);
    expect(diff.coords).toEqual(firstlyUpdatedCoords);
  });

  it('compare points by address value if no coordinates are present for location points', () => {
    const wayPoints = [
      getFakeWayPoint([20, 20], 'Питер'),
      getFakeWayPoint([30, 30], 'Казань'),
    ];

    const locations = [
      getFakeLocationPoint(0, [], 'Питер'),
      getFakeLocationPoint(0, [], 'Москва'),
    ];

    const diff = diffPoints(locations, wayPoints);

    expect(diff.index).toBe(1);
    expect(diff.coords).toEqual([30, 30]);
  });

  it('returns null when each location point has a matching way point', () => {
    const wayPoints = [
      getFakeWayPoint([15, 16]),
      getFakeWayPoint([17, 18]),
    ];

    const locations = [
      getFakeLocationPoint(0, [15, 16], 'Питер'),
      getFakeLocationPoint(0, [17, 18], 'Казань'),
    ];

    const diff = diffPoints(locations, wayPoints);
    expect(diff).toBeNull();
  });

  it('returns null when points differ only by index order', () => {
    const wayPoints = [
      getFakeWayPoint([15, 16]),
      getFakeWayPoint([17, 18]),
    ];

    const locations = [
      getFakeLocationPoint(0, [17, 18], 'Казань'),
      getFakeLocationPoint(0, [15, 16], 'Питер'),
    ];

    const diff = diffPoints(locations, wayPoints);
    expect(diff).toBeNull();
  });
});
