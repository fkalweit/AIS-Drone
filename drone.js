var Bebop = require('node-bebop');

var drone = Bebop.createClient();
var connected = false;

drone.connect(function() {
  connected = true;
  console.log("Drone connected!");

  drone.GPSSettings.resetHome();
  //drone.WifiSettings.outdoorSetting(1);

  drone.on("battery", function(status){
    console.log(status);
  });

  drone.on("flying", function(derp){
    console.log("and now... we fly!!!");
  });

  drone.on("takingOff", function(derp){
    console.log("Ladies and Gentlemen.... TAKEOFF!!!");
  });

  drone.on("SpeedBridleEvent", function(status){
    console.log(status);
  });

  /*drone.on("AltitudeChanged", function(altitude){
    //console.log("Altitude: " + altitude.class);
  });

  drone.on("LongitudeChanged", function(longitude){
    console.log("Longitude: " + longitude);
  });*/

  drone.on("GPSFixStateChanged", function(pos){
    console.log(pos);
  });

  drone.on("PositionChanged", function(pos){
    //console.log(pos);
    console.log("Position: H: " + pos.altitude +  " L: " + pos.longitude + " B: " + pos.latitude);
  });
})

// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Drohne in anderen Modulen.
module.exports = {
  getAndActivateDrone: function () {
    return drone;
  },

  isConnected: function (){
    return connected;
  },

  getBatteryStatus: function(callback){
     drone.battery(callback);
  }
};
