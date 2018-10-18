import { updateLocationPoint, moveLocationPoint } from './LocationPoint.js';

const getStubLocations = () => {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
};

let locations;

beforeEach(() => {
  locations = getStubLocations();
});

describe('updateLocationPoint()', () => {
  it('should throw an error when accessed index is out of array range', () => {
    const locations = [];
    const index = 10;
    const address = 'Москва, Новый Арбат';

    expect(() => {
      updateLocationPoint(locations, index, address);
    }).toThrow();
  });

  it('should return an array with updated locationPoint', () => {
    const index = 2;
    const address = 'Москва, Новый Арбат';
    const expected = getStubLocations();
    expected[2] = { id: 2, value: address };

    expect(updateLocationPoint(locations, index, address)).toEqual(expected);
  });

  it('should not mutate the provided locations array', () => {
    updateLocationPoint(locations, 0, '');
    expect(locations).toEqual(locations);
  });
});

describe('moveLocationPoint()', () => {
  it('should move point from position 0 to 3', () => {
    const expected = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 0 }];

    expect(moveLocationPoint(locations, 0, 3)).toEqual(expected);
  });

  it('should move point from position 1 to 2', () => {
    const expected = [{ id: 0 }, { id: 2 }, { id: 1 }, { id: 3 }];

    expect(moveLocationPoint(locations, 1, 2)).toEqual(expected);
  });

  it('should throw an error when first position is out of the locations length', () => {
    expect(() => {
      moveLocationPoint(locations, 0, 10);
    }).toThrow();
  });

  it('should throw an error when the second position is out of the locations length', () => {
    expect(() => {
      moveLocationPoint(locations, 10, 3);
    }).toThrow();
  });
  
  it('should not mutate the provided locations array', () => {
    moveLocationPoint(locations, 0, 1);
    expect(locations).toEqual(locations);
  });
});
