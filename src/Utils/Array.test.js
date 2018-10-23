import { notEmptyArray } from './Array.js';

describe('notEmptyArray()', () => {
  it('should return false if a given arg is an undefined', () => {
    expect(notEmptyArray(undefined)).toBe(false);
  });
  
  it('should return false if a given arg is not an array', () => {
    expect(notEmptyArray({})).toBe(false);
  });

  it('should return false if a given arg is an empty array', () => {
    expect(notEmptyArray([])).toBe(false);
  });

  it('should return true if a given arg is an array with items', () => {
    expect(notEmptyArray([1, 2, 3])).toBe(true);
  });
});
