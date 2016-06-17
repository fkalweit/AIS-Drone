//Geofencing-Variablen - Start
var distanceCalc = require('./GpsDistanceCalculator');
var areaRadiusInMeter = 10.5;
var isOutOfArea = false;
var currentDistanceFromHome = -1;
var OutOfAreaContextState = "";
//Geofencing-Variablen - Ende

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
    });

    drone.on("NumberOfSatelliteChanged", function(num) {
        satellites = num.numberOfSatellite;
    });

    drone.on("PositionChanged", function(pos) {
        //console.log(pos);
        altitude = pos.altitude;
        longitude = pos.longitude;
        latitude = pos.latitude;


        if (!((h_longitude == 0) && (h_latitude == 0))) {

            var lastDistanceFromHome = currentDistanceFromHome
            currentDistanceFromHome = distanceCalc.getDistanceInMeter(h_latitude, h_longitude, latitude, longitude);

            var wasOutOfArea = isOutOfArea;
            isOutOfArea = (currentDistanceFromHome > areaRadiusInMeter);

            OutOfAreaContextState = "unknown";


            if (isOutOfArea) {
                if (wasOutOfArea) {
                    if (Math.abs(lastDistanceFromHome - currentDistanceFromHome) > 1) { //erst nach einer Mindestbewegung prüfen in welche Richtung die Drohne fliegt
                        if (currentDistanceFromHome > lastDistanceFromHome) { //Drohne entfernt sich weiter vom Home-Punkt
                            console.log("Drone is out of Area")
                            OutOfAreaContextState = "entfernt_sich_weiter";
                            //drone.stop();
                        } else {
                            OutOfAreaContextState = "fliegt_richtung_home";
                        }
                    } else {
                        //OutOfAreaContextState="geringe Bewegung";
                    }

                } else {
                    console.log("Drone leaves Area")
                    OutOfAreaContextState = "hat_Bereich_verlassen";
                    drone.stop();
                }
            }

        }

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

// function printGUI(){
//
//   if(usegui){
//
//     console.table([
//     {
//       State: 'Is Connected: ',
//       CurrentValue: String(connected)
//     }, {
//       State: 'Balance Board Connected: ',
//       CurrentValue: boardConnected
//     }, {
//       State: 'Balance Board Activated: ',
//       CurrentValue: boardActivated
//     }, {
//       State: 'Drohnestatus: ',
//       CurrentValue: state
//     }, {
//       State: 'Battery: ',
//       CurrentValue: battery
//     }, {
//       State: 'Satellites: ',
//       CurrentValue: satellites
//     }, {
//       State: 'GPS: ',
//       H: altitude,
//       L: longitude,
//       B: latitude
//     }, {
//       State: 'Home Position:',
//       H: h_altitude,
//       L: h_longitude,
//       B: h_latitude
//     }, {
//       State: 'DistanceFromHome: ',
//       CurrentValue: currentDistanceFromHome
//     }, {
//       State: 'OutOfArea: ',
//       CurrentValue: isOutOfArea
//     }, {
//       State: 'OutOfAreaContextState: ',
//       CurrentValue: OutOfAreaContextState
//     }
//   ]);
//
//     console.log("\r\n");
//     console.log("\r\n");
//   }
// };

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
    }
};
