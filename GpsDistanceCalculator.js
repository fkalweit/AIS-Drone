function getDistanceInMeter(latitudeStart, longitudeStart, latitudeEnd, longitudeEnd) {

// QUELLE: https://www.kompf.de/gps/distcalc.html
//
// distance = sqrt(dx * dx + dy * dy)
// //mit distance: Entfernung in km
// dx = 111.3 * cos(lat) * (lon1 - lon2)
// lat = (lat1 + lat2) / 2 * 0.01745
// dy = 111.3 * (lat1 - lat2)
// //lat1, lat2, lon1, lon2: Breite, Länge in Grad

  var lat = ((latitudeStart + latitudeEnd) / 2) * 0.01745; //Grad in Bogenmaß umrechnen
  var dx = 111.3 * Math.cos(lat) * (longitudeStart - longitudeEnd);
  var dy = 111.3 * (latitudeStart - latitudeEnd);
  var distanceInKm = Math.sqrt(dx * dx + dy * dy)
  var distanceInMeter = distanceInKm*1000

  return distanceInMeter;

  //return "distanceInKm: "+distanceInKm
  //+"\n"+
  //"distanceInMeter: "+distanceInMeter;

  //return "INPUT:"+" "+latitudeStart+" "+longitudeStart+" "+latitudeEnd+" "+longitudeEnd;
}

// console.log("\n");
// console.log(getDistanceInMeter(49.9917,8.41321,50.0049,8.42182));
// console.log("\n");
// console.log(getDistanceInMeter(49.00001, 9.00001, 49.00002, 9.00002));
// console.log("\n");



// function isDroneOutOfArea(homeLatitude, homeLongitude, currentLatitude, currentLongitude, areaRadiusInMeter) {
//
//   return ( areaRadiusInMeter < getDistanceInMeter(homeLatitude, homeLongitude, currentLatitude, currentLongitude) );
//
// }

//console.log("Boolean:" + isDroneOutOfArea(1,2,3,4));
// console.log(isDroneOutOfArea(49.00001, 9.00001, 49.00002, 9.00002,1));
// console.log(isDroneOutOfArea(49.00001, 9.00001, 49.00002, 9.00002,10));


// Export-Methoden des Moduls.
module.exports = {
  getDistanceInMeter: function(latitudeStart, longitudeStart, latitudeEnd, longitudeEnd) {
    return getDistanceInMeter(latitudeStart, longitudeStart, latitudeEnd, longitudeEnd);
  }
//  isDroneOutOfArea: function(homeLatitude, homeLongitude, currentLatitude, currentLongitude, areaRadiusInMeter) {
//    return isDroneOutOfArea(homeLatitude, homeLongitude, currentLatitude, currentLongitude, areaRadiusInMeter);
//  }
};
