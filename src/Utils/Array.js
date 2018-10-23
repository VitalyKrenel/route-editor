/**
 * Check wether a given arg is not an empty array. 
 * Returns false if the arg is not an array or 
 * if the arg is an array, but it's not empty.
 *
 *  @param {*} test - possibly array and possibly empty
 * @returns {boolean}
 */
export function notEmptyArray(test) {
  return Array.isArray(test) && test.length !== 0;
}
