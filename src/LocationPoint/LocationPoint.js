/**
 * @typedef {Object} LocationPoint
 * @property {number} id - unique id (may be used as a key)
 * @property {string} value - Human readable address of the point
 */


/**
 * Cretes a factory for creating LocationPoints with automatic id increment.
 * 
 * @param {number} initialId - start incrementing id from
 * @returns {function}
 */
export const makeLocationPointFactory = ((initialId = 0) => {
  let id = initialId;

  /**
   * LocationPoint object (plain object) with the provided address,
   * and calculated id.
   * 
   * @param {string} address
   * @param {arrray} coords
   * @returns {LocationPoint}
   */
  return function createLocationPoint(address, coords = []) {
    if (address === undefined) {
      throw new Error('MisiingArgument: Expected to get an address arg, but undefined encountered');
    }

    const locationPoint = {
      id,
      coords,
      value: address,
    };

    id = id + 1;

    return locationPoint;
  };
});

/**
 * Create a LocationPoint with a provided address and add it to a copy of
 * locations array. The method does not mutate the data.
 *
 * @param {Array.<LocationPoint>} locations
 * @param {LocationPoint} loactionPoint
 * @returns {Array.<LocationPoint>} Returns new array containing created point
 */
export function addLocationPoint(locations, locationPoint) {
  if (locationPoint.value === undefined || locationPoint.id === undefined) {
    throw new Error('InvalidArgument: provided object does not match the location point signature');
  }

  return locations.concat([locationPoint]);
};

/**
 * Returns a new array without the LocationPoint with a provided id. 
 * 
 * The method does not mutate the provided args.
 * 
 * @param {Array.<LocationPoint>} locations
 * @param {number} id - unique id of the point that should be deleted
 * @returns {Array.<LocationPoint>} new locations array
 */
export function deleteLocationPoint(locations, id) {
  if (id === undefined) {
    throw new Error('MissingArgument: Expected to get a point id as the second argument, but undefined encountered');
  }

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
  
  if (fromPosition < 0 || fromPosition >= locations.length) {
    throw new Error('RangeError: Trying to access the fromPosition being out of the locations array range');
  }

  if (toPosition < 0 || toPosition >= locations.length) {
    throw new Error('RangeError: Trying to access the toPosition being out of the locations array range');
  }

  const locs = locations.slice(0);
  const extractedPoint = locs.splice(fromPosition, 1)[0];
  locs.splice(toPosition, 0, extractedPoint);
  return locs;
}

/**
 * 
 * @typedef {Object} Update 
 * @property {Array.<number>?} coords - two-items array of point coordinates
 * @property {string?} value - text address of the point
 */

/**
 * Returns a new array with the LocationPoint at the specified index being 
 * updated with the address value. If update object is null, the method will
 * reassign the element at a given index, without changing an actual values 
 * (only the item reference will be changed).
 * 
 * The method does not mutate the provided args.
 * 
 * @param {Array.<LocationPoint>} locations 
 * @param {number} index
 * @param {Update|null} update
 * 
 * @returns {Array.<LocationPoint>}
 */
export function updateLocationPoint(locations, index, update) {
  if (index < 0 || index >= locations.length) {
    throw new Error(`RangeError: Trying to access element being out of the locations array range`);
  }

  if (typeof update !== 'object') {
    throw new Error('SignatureError: Expected to get the second argument as an object');
  }

  if (update && (!Array.isArray(update.coords) && !update.value)) {
    throw new Error('ArgumentSignatureError: Expected to get the second update arg with either address or coordinates or both, but no defined property encountered')
  }
  const locs = locations.slice(0);
  
  locs[index] = Object.assign({}, locs[index], update);

  return locs;
}
