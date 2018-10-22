/**
 * @jest-environment node
 */

import {
  updateLocationPoint,
  moveLocationPoint,
  addLocationPoint,
  deleteLocationPoint,
  makeLocationPointFactory
} from './LocationPoint.js';

const getStubLocations = () => {
  return [
    { id: 0, value: 'Москва', coords: [1, 2] },
    { id: 1, value: 'Питер', coords: [3, 4] },
    { id: 2, value: 'Казань', coords: [5, 6] },
    { id: 3, value: 'Владивосток', coords: [7, 8] },
  ];
};

let locations;

beforeEach(() => {
  locations = getStubLocations();
});

describe('createLocationPoint()', () => {
  let createLocationPoint;

  beforeEach(() => {
    createLocationPoint = makeLocationPointFactory();
  });

  it('should return a location point with the provided address in value property', () => {
    const address = 'Москва, станция метро Китай-город';

    expect(createLocationPoint(address).value).toEqual(address);
  });

  it('should return a location point with id = 0', () => {
    const address = 'Москва, станция метро Китай-город';

    expect(createLocationPoint(address).id).toEqual(0);
  });

  it('should return a location point with id = 3', () => {
    const address = 'Москва, станция метро Китай-город';
    createLocationPoint(address);
    createLocationPoint(address);
    createLocationPoint(address);

    expect(createLocationPoint(address).id).toEqual(3);
  });

  it('should throw an error if address arg is undefined', () => {
    expect(() => {
      createLocationPoint(undefined);
    }).toThrow();
  });

  it('should return a location point with the specified coords', () => {
    const coords = [12, 13];
    const address = 'Москва';

    expect(createLocationPoint(address, coords).coords).toEqual(coords);
  });

  it('should return a location point with coords property being an empty array when no coords provided', () => {
    const address = 'Москва';
    expect(createLocationPoint(address).coords).toEqual([]);
  });
});


describe('addLocationPoint()', () => {
  it('should return an array with added new LocationPoint', () => {
    const expected = getStubLocations();
    const address = 'Москва, Новый Арбат';
    const locPoint = { id: expected.length, value: address };
    expected.push(locPoint);

    expect(addLocationPoint(locations, locPoint)).toEqual(expected);
  });

  it('expect added locationPoint to have the provided address', () => {
    const expected = getStubLocations();
    const address = 'Москва, Новый Арбат';
    const locPoint = { id: expected.length, value: address };
    expected.push(locPoint);

    const result = addLocationPoint(locations, locPoint);

    expect(result.pop().value).toEqual(expected.pop().value);
  });

  it('should throw an Error if location point arg is undefined', () => {
    expect(() => {
      addLocationPoint(locations, undefined);
    }).toThrow();
  });

  it('should throw an Error if the value property of location point is undefined', () => {
    expect(() => {
      addLocationPoint(locations, { id: 0 });
    }).toThrow();
  });

  it('should throw an Error if the id property of location point is undefined', () => {
    expect(() => {
      addLocationPoint(locations, { value: 'Москва, Красная площадь' });
    }).toThrow();
  });

  it('should not mutate the provided locations array', () => {
    const address = 'Москва, ВДНХ';

    addLocationPoint(locations, { id: 0, value: address });
    expect(locations).toEqual(locations);
  });
});

describe('deleteLocationPoint()', () => {
  it('should delete the point with the specified index', () => {
    const index = 1;
    const expected = getStubLocations();
    expected.splice(index, 1);

    expect(deleteLocationPoint(locations, index)).toEqual(expected);
  });

  it('should throw an error when index is undefined', () => {
    expect(() => {
      deleteLocationPoint(locations, undefined)
    }).toThrow();
  });

  it('should not mutate the provided locations array', () => {
    const index = 1;

    deleteLocationPoint(locations, index);

    expect(locations).toEqual(locations);
  });
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

  it('should thorw an error if update arg is not an object', () => {
    expect(() => {
      updateLocationPoint(locations, 0, '');
    }).toThrow();
  });

  it('should not throw an error if update arg is intentionally null', () => {
    expect(() => {
      updateLocationPoint(locations, 0, null);
    }).not.toThrow();
  });

  it('should not update any location point when update arg is null', () => {
    expect(updateLocationPoint(locations, 0, null)).toEqual(locations);
  })

  it('update only value property correctly', () => {
    const index = 2;
    const address = 'Москва, Новый Арбат';
    const expected = getStubLocations();
    expected[index].value = address;

    expect(updateLocationPoint(locations, index, { value: address })).toEqual(expected);
  });

  it('update only coords property correctly', () => {
    const index = 2;
    const coords = [12, 13];
    const expected = getStubLocations();
    
    expected[index].coords = coords;

    expect(updateLocationPoint(locations, index, { coords })).toEqual(expected);
  });

  it('update both value and coords properties correctly', () => {
    const index = 2;
    const coords = [55, 22];
    const address = 'Московская область';
    const expected = getStubLocations();

    expected[index].value = address;
    expected[index].coords = coords;

    expect(updateLocationPoint(locations, index, { value: address, coords })).toEqual(expected);
  });

  it('should not mutate the provided locations array', () => {
    updateLocationPoint(locations, 0, { value: 'Москва', coords: [58, 37] });
    expect(locations).toEqual(locations);
  });
});

describe('moveLocationPoint()', () => {
  it('should move point from position 0 to 3', () => {
    const locations = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
    const expected = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 0 }];

    expect(moveLocationPoint(locations, 0, 3)).toEqual(expected);
  });

  it('should move point from position 2 to 1', () => {
    const locations = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
    const expected = [{ id: 0 }, { id: 2 }, { id: 1 }, { id: 3 }];

    expect(moveLocationPoint(locations, 2, 1)).toEqual(expected);
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
