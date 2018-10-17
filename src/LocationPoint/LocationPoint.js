/**
 * @typedef {Object} LocationPoint
 * @property {number} id - unique id (may be used as a key)
 * @property {string} value - Human readable address of the point
 */

/**
 * Create a LocationPoint with a provided address and add it to a copy of
 * locations array. The method does not mutate the data.
 *
 * @param {Array.<LocationPoint>} locations
 * @param {string} address
 * @returns {Array.<LocationPoint>} Returns new array containing created point
 */
export function addLocationPoint(locations, address) {
  return locations.concat([{
    value: address,
    id: locations.length + 1,
  }]);
};

/**
 * Returns a new array without the LocationPoint with a provided id. 
 * 
 * The method does not mutate the provided args.
 * 
 * @param {Array.<LocationPoint>} locations
 * @param {number} id
 * @returns {Array.<LocationPoint>} a new locations array
 */
export function deleteLocationPoint(locations, id) {
  return locations.filter((location) => {
    return location.id !== id; 
  });
}

/**
 * Returns a new locations array with a moved LocationPoint from fromPosition
 * to toPosition. Method extracts the point and latter inserts it so other
 * points in range [fromPosition..toPosiition] got shifted. 
 * 
 * The method does not mutate the provided args.
 * 
 * @param {Array.<LocationPoint>} locations
 * @param {number} fromPosition
 * @param {number} toPosition
 * @returns {Array.<LocationPoint>}
 */
export function moveLocationPoint(locations, fromPosition, toPosition) {
  const locs = locations.slice(0);
  const extractedPoint = locs.splice(fromPosition, 1)[0];
  locs.splice(toPosition, 0, extractedPoint);
  return locs;
}

/**
 * Returns a new array with the LocationPoint at the specified index being 
 * updated with the address value. 
 * 
 * The method does not mutate the provided args.
 * 
 * @param {Array.<LocationPoint>} locations 
 * @param {number} index
 * @param {string} address
 * 
 * @returns {Array.<LocationPoint>}
 */
export function updateLocationPoint(locations, index, address) {
  const locs = locations.slice(0);
  const { id } = locs[index];

  locs[index] = { id, value: address };
  
  return locs;
}
