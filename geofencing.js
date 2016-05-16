"use strict";

var bebop = require('node-bebop');

var drone = bebop.createClient();

var converter = require('coordinator'),
    fn = converter('latlong', 'UTM'),

var firstGPSMeasure = true;
var gpsRecording = false;

var homeLatitude = 0;
var homeLongitude = 0;

var homeUTM_North = 0;
var homeUTM_East = 0;

drone.connect(function() {
  drone.GPSSettings.resetHome();
  drone.WifiSettings.outdoorSetting(1);
  console.log('Connected')
});

drone.on("PositionChanged", function (data) {
  //update view with current GPS console.log(data)

  if(gpsRecording) {

    var latitude = data.latitude,
        longitude = data.longitude,
        utm = fn(latitude, longitude, 32)

    if(firstGPSMeasure) {
      if(latitude!=500 && longitude!=500) {

      homeLatitude = data.latitude;
      homeLongitude = data.longitude;

      homeUTM_North = utm.northing;
      homeUTM_East = utm.easting;
      firstGPSMeasure = false;
      }
    } else {

      /*Now consider the point 51_30 latitude and 2_20 longitude. Is that point
      within 5500 meters of the radius point ? Convert to UTM North and East
      coordinates of 5705639.9 , 453725.1 . The direction from the radius to the
      point is the InvTan((453725.1 - 447845.9) / (5705639.9 - 5696428.3)) or
      N32.5476E degrees. (The result is N because (5705639.9 - 5696428.3) is
      positive and the result is E because (453725.1 - 447845.9) is positive.) Now
      the distance from the radius to the point is the Sqrt of ((453725.1 -
      447845.9)^2 + (5705639.9 - 5696428.3)^2) or 10927.9 meters. The considered
      point is beyond the radius of the curve based solely on the distance
      calculation...*/


      //var direction = Math.InvTan((homeUTM_North - utm.northing) /(homeUTM_East-utm.easting));
      var distanceFromHome = Math.Sqrt((homeUTM_North - utm.northing)^2 + (homeUTM_East-utm.easting)^2);


}

  }
  //console.log('alt:' + data.altitude)
})

/*drone.on("PositionChanged", function (data) {
  //update view with current GPS console.log(data)

    console.log('lat: ' + data.latitude)
    console.log('lon:' +  data.longitude)
  }
  //console.log('alt:' + data.altitude)
})*/
