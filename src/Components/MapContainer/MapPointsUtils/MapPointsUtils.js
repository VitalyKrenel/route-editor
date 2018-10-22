/**
 * Compare locationsPoints and wayPoints. If any locPoint does not
 * match a wayPoint, return it with updated data (adress).
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
      return locPoint.value === wayPoint.properties.get('request');
    });
    
    if (foundIndex === -1) {
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
