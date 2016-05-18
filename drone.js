var Bebop = require('node-bebop');

// Zum installieren: npm install console.table --save
var Table = require('console.table');

var Geofencing = require('./geofencing')

var usegui = false;

var drone = Bebop.createClient();
var connected = false;

var battery = 0;
var state = "";

// Current GPS Position
var altitude = 0.0;
var longitude = 0.0;
var latitude = 0.0;

var utm;

// Home GPS Position
var h_altitude = 0.0;
var h_longitude = 0.0;
var h_latitude = 0.0;
var h_isSet = false;

var h_utm;

drone.connect(function() {
  connected = true;
  printGUI();

  drone.GPSSettings.resetHome();
  //drone.WifiSettings.outdoorSetting(1);

  drone.on("ready", function() {
    state = "ready";
    printGUI();
  });

  drone.on("flying", function(derp){
    state = "flying";
    printGUI();
  });

  drone.on("landed", function() {
    state = "landed";
    printGUI();
  });

  drone.on("landing", function() {
    state = "landing";
    printGUI();
  });

  drone.on("hovering", function() {
    state = "hovering";
    printGUI();
  });

  drone.on("takingOff", function(){
    state = "takingOff";
    printGUI();
  });

  drone.on("battery", function(status){
    battery = status;
    printGUI();
  });

  drone.on("HomeChanged", function(pos){
    h_altitude = pos.altitude;
    h_longitude = pos.longitude;
    h_latitude = pos.latitude;
    h_utm = convertLatLongToUtm(h_latitude, h_longitude, 32);
    h_isSet = true;
    printGUI();
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
    altitude = pos.altitude;
    longitude = pos.longitude;
    latitude = pos.latitude;

    if(h_isSet) {
      utm = convertLatLongToUtm(latitude, longitude,32);
      var distanceFromHome = Math.sqrt(Math.pow(h_utm.northing - utm.northing,2) + Math.pow(h_utm.easting - utm.easting,2));
        if(distanceFromHome>10)
          console.log('Drone out of range:' + distanceFromHome + ">" + 10)
          drone.client.stop();
        }
    }

    printGUI();
  });
});

function printGUI(){
  if(usegui){
    console.log('\033[2J');

    console.table([
    {
      State: 'Is Connected: ',
      CurrentValue: String(connected)
    }, {
      State: 'Drohnestatus: ',
      CurrentValue: state
    }, {
      State: 'Battery: ',
      CurrentValue: battery
    }, {
      State: 'GPS: ',
      H: altitude,
      L: longitude,
      B: latitude
    }, {
      State: 'Home Position:',
      H: h_altitude,
      L: h_longitude,
      B: h_latitude
    }
  ]);

    console.log("\r\n");
    console.log("\r\n");
  }
};

// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Drohne und anderer Funktionen in anderen Modulen.
module.exports = {
  getAndActivateDrone: function () {
    return drone;
  },

  isConnected: function (){
    return connected;
  },

  setCurrentPositionToHome: function(){
    drone.GPSSettings.setHome(latitude, longitude, altitude);
    printGUI();
  },

  useGUI: function(value){
    usegui = value;
  }
};
