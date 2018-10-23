/**
 * Compare 2 points and check whether they match each other, i.e. they have
 * equal coordinates. If coordinates aren't specified for location point,
 * comparison is performed by location point's `address`.
 * 
 * @param {import("../LocationPoint/LocationPoint").LocationPoint} locPoint 
 * @param {GeoObject} wayPoint
 * 
 * @see https://clck.ru/EapUj
 * 
 * @returns {boolean} true if the points match each other, otherwise false
 */
function comparePoints(locPoint, wayPoint) {
  // Compare loc and way point's coords if defined or fallback to
  // address, if those match - return wayPoint index  
  if (locPoint.coords.length !== 0) {
    const wayPointCoords = wayPoint.geometry.getCoordinates();
    return (
      locPoint.coords[0] === wayPointCoords[0] &&
      locPoint.coords[1] === wayPointCoords[1]
    );
  }

  return locPoint.value === wayPoint.properties.get('request');
}

/**
 * Compare locationsPoints and wayPoints. If any locPoint does not
 * match a wayPoint, return an object representing locPoint `index` in locations array, and wayPoint `coords`, `address` and `request`.
 * 
 * **Note**: `address` property will be avaliable only if 
 * the `reverseGeocoding` option for multiRouter is set to true, otherwise it's
 * undefined.
 * 
 * **Note**: `request` is either a requesting address or requesting coordinates.
 * 
 * **Note**: Way point's `address` and `request` properties most of the time do not match because address is formatted by Yandex.
 * 
 * @param {Array} locationPoints 
 * @param {Array} routeWayPoints
 * 
 * @returns {Object}
 */
export function diffPoints(locationPoints, routeWayPoints) {
  const wayPoints = routeWayPoints.slice(0);

  for (let i = 0; i < locationPoints.length; i++) {
    const locPoint = locationPoints[i];
    
    const wayPointHasMatchIndex = wayPoints.findIndex((wayPoint) => 
      comparePoints(locPoint, wayPoint),
    );
    
    // Way point has no matching location point
    // locationPoints length may be greater/lesser than wayPoints (if func was
    // called after a new location point was added/removed)
    if (wayPointHasMatchIndex === -1 && wayPoints.length !== 0) {
      const point = wayPoints[0];
      const newCoords = point.geometry.getCoordinates();
      // Return a diff object to update a location point at the specified 
      // index with new coordinates
      return {
        index: i,
        coords: newCoords,
        address: point.properties.get('address'),
        request: point.properties.get('request'),
      };
    } else {
      // Not perform extra steps
      if (wayPoints.length === 0) break;

      // Remove a wayPoint that wasn't changed {it has a pair 
      // in location points array)
      wayPoints.splice(wayPointHasMatchIndex, 1);
    }
  }

  return null;
}
