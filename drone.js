var Bebop = require('node-bebop');

// Zum installieren: npm install console.table --save
var Table = require('console.table');

var usegui = false;

var drone = Bebop.createClient();
var connected = false;

var battery = 0;
var state = "";

// Current GPS Position
var altitude = 0.0;
var longitude = 0.0;
var latitude = 0.0;

// Home GPS Position
var h_altitude = 0.0;
var h_longitude = 0.0;
var h_latitude = 0.0;

drone.connect(function() {
  connected = true;
  drone.MediaStreaming.videoEnable(1);
  printGUI();

  drone.GPSSettings.resetHome();
  drone.Calibration.magnetoCalibration(1);
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
    printGUI();
  });

  drone.on("MagnetoCalibrationStateChanged", function(mag){
    console.log(mag);
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
    printGUI();
  });
});

process.on('exit', (code) => {
  drone.Network.disconnect()
  console.log("Disconnected from the drone");
  console.log('About to exit with code:', code);
});

process.on('SIGINT', function() {
  console.log(" ");
  console.log("Caught interrupt signal");
  process.exit();
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
  },

  videoEnable: function(){
    drone.MediaStreaming.videoEnable(1);
  },

  getStream:  function(){
    drone.MediaStreaming.videoEnable(1);
    return drone.getMjpegStream();
  }

};
