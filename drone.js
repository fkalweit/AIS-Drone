//Geofencing-Variablen - Start
var distanceCalc = require('./GpsDistanceCalculator');
var areaRadiusInMeter = 2;
var isOutOfArea = false;
var wasOutOfArea = false;
var currentDistanceFromHome = -1;
var OutOfAreaContextState = "no area def.";
//Geofencing-Variablen - Ende

var Main = require('./main');

var log = require('./logger').createLogger('Drone');

var Bebop = require('node-bebop');

var Table = require('console.table');

var usegui = true;

var drone = Bebop.createClient();
var connected = false;

var boardConnected = false;
var boardActivated = false;

var battery = "not set yet";
var state = "";
var satellites = "";

// Current GPS Position
var altitude = 0.0;
var longitude = 0.0;
var latitude = 0.0;

// Home GPS Position
var h_altitude = 0.0;
var h_longitude = 0.0;
var h_latitude = 0.0;

// Media Related Settings
var currently_recording = false;

drone.connect(function() {
    connected = true;
    drone.MediaStreaming.videoEnable(1);

    drone.GPSSettings.resetHome();

    drone.on("ready", function() {
        state = "ready";
    });

    drone.on("flying", function(derp) {
        state = "flying";
    });

    drone.on("landed", function() {
        state = "landed";
    });

    drone.on("landing", function() {
        state = "landing";
    });

    drone.on("hovering", function() {
        state = "hovering";
    });

    drone.on("takingOff", function() {
        state = "takingOff";
    });

    drone.on("battery", function(status) {
        battery = status + "%";
    });

    drone.on("HomeChanged", function(pos) {
        h_altitude = pos.altitude;
        h_longitude = pos.longitude;
        h_latitude = pos.latitude;
        OutOfAreaContextState = "Drone is in area";
    });

    drone.on("NumberOfSatelliteChanged", function(num) {
        satellites = num.numberOfSatellite;
    });

    drone.on("PositionChanged", function(pos) {
        altitude = pos.altitude;
        longitude = pos.longitude;
        latitude = pos.latitude;


        //if(Main.getRaceStatus()) {

          if (!((h_longitude == 0) && (h_latitude == 0))) {

              var lastDistanceFromHome = currentDistanceFromHome
              currentDistanceFromHome = distanceCalc.getDistanceInMeter(h_latitude, h_longitude, latitude, longitude);


              isOutOfArea = (currentDistanceFromHome > areaRadiusInMeter);

              //OutOfAreaContextState = "unknown";

              if (isOutOfArea && !wasOutOfArea) {

                log.info("Drone leaves Area");
                OutOfAreaContextState = "Drone is out of area";
                Main.deactivateAll();
                Main.abortTakeTime();
                drone.stop();
                wasOutOfArea = true;

              }else if (!isOutOfArea && wasOutOfArea) {
                log.info("Drone enters Area");
                OutOfAreaContextState = "Drone is in area";
                wasOutOfArea = false;
              }
          }
        //}
    });
});
// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Drohne und anderer Funktionen in anderen Modulen.
module.exports = {
    getAndActivateDrone: function() {
        return drone;
    },

    isConnected: function() {
        return connected;
    },

    setCurrentPositionToHome: function() {
        drone.GPSSettings.setHome(latitude, longitude, altitude);
    },

    useGUI: function(value) {
        usegui = value;
    },

    videoEnable: function() {
        drone.MediaStreaming.videoEnable(1);
    },

    getStream: function() {
        drone.MediaStreaming.videoEnable(1);
        return drone.getMjpegStream();
    },

    toggleVideoRecording: function() {
        currently_recording = !currently_recording;
        if(currently_recording) {
          log.info("STOP RECORDING");
          drone.stopRecording();
        } else {
          log.info("START RECORDING");
          drone.startRecording();
        }
    },

    getAltitude: function() {
        return altitude;
    },

    getLongitude: function() {
        return longitude;
    },

    getLatitude: function() {
        return latitude;
    },

    getHomeAltitude: function() {
        return h_altitude;
    },

    getHomeLongitude: function() {
        return h_longitude;
    },

    getHomeLatitude: function() {
        return h_latitude;
    },

    getState: function() {
        return state;
    },

    getSatellites: function() {
        return satellites;
    },

    getBattery: function() {
        return battery;
    },

    getAreaRadiusInMeter: function() {
        return areaRadiusInMeter;
    },

    getOutOfArea: function() {
      return isOutOfArea;
    },

    getCurrentDistanceFromHome: function() {
      return currentDistanceFromHome;
    },

    getOutOfAreaContextState: function() {
      return OutOfAreaContextState;
    },

    setBoardConnected: function(val) {
        boardConnected = val;
    },

    setBoardActivated: function(val) {
        boardActivated = val;
    },


    setAreaRadiusInMeter: function(val) {
        areaRadiusInMeter = val;
    },

    getAreaRadiusInMeter: function() {
      return areaRadiusInMeter;
    }
};
