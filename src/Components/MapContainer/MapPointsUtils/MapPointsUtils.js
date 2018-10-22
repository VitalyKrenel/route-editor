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
  let updatedLocPoint = null;
  const wayPoints = routeWayPoints.slice(0);

  locationPoints.forEach((locPoint, index) => { 
    const foundIndex = wayPoints.findIndex((wayPoint) => {
      // Match loc and way point with coords if defined or fallback to
      // address comparison  
      if (locPoint.coords.length !== 0) {
        const wayPointCoords = wayPoint.geometry.getCoordinates();
        return (
          locPoint.coords[0] === wayPointCoords[0] &&
          locPoint.coords[1] === wayPointCoords[1]
        );
      }
      return locPoint.value === wayPoint.properties.get('request');
    });
    
    if (foundIndex === -1 && wayPoints.length !== 0) {
      // Define locationPoint that has no matching wayPoint
      updatedLocPoint = {
        index,
        coords: wayPoints[0].geometry.getCoordinates(),
        address: wayPoints[0].properties.get('address'),
        request: wayPoints[0].properties.get('request'),
      }; 
    } else {
      // Remove a wayPoint that wasn't dragged on Map
      wayPoints.splice(foundIndex, 1);
    }
  });

  return updatedLocPoint;
}
