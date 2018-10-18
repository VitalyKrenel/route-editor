import { moveLocationPoint } from './LocationPoint.js';

const getStubLocations = () => {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
};

describe('moveLocationPoint()', () => {
  let locations;
  beforeEach(() => {
    locations = getStubLocations();
  });

  it('should move point from position 0 to 3', () => {
    const expected = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 0 }];

    expect(moveLocationPoint(locations, 0, 3)).toEqual(expected);
  });

  it('should move point from position 1 to 2', () => {
    const expected = [{ id: 0 }, { id: 2 }, { id: 1 }, { id: 3 }];

    expect(moveLocationPoint(locations, 1, 2)).toEqual(expected);
  });

  it('should return an empty array when locations array is empty', () => {
    const locations = [];
    const expected = [];

    expect(moveLocationPoint(locations, 1, 3)).toEqual(expected);
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
  
});
