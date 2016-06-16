//Geofencing-Variablen - Start
var distanceCalc = require('./GpsDistanceCalculator');
var areaRadiusInMeter = 10.5;
var isOutOfArea = false;
var currentDistanceFromHome = -1;
var OutOfAreaContextState = "";
//Geofencing-Variablen - Ende

var log = require('./logger').createLogger('Drone');

var Bebop = require('node-bebop');

var clui  = require('clui');
var clc = require('cli-color');

// Zum installieren: npm install console.table --save
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


// setInterval(function () {
//      if(usegui) printGUI();
// }, 500);

// var out = process.stdout;
// var numOfLinesToClear = 13;
// out.write("1\n");   // prints `1` and new line
// ++numOfLinesToClear;
// out.write("2\n");
// ++numOfLinesToClear;
// process.stdout.moveCursor(0,-numOfLinesToClear); //move the cursor to first line
// setTimeout(function () {
//     process.stdout.clearLine();
//     out.cursorTo(0);            // moves the cursor at the beginning of line
//     out.write("3");             // prints `3`
//     out.write("\n4");           // prints new line and `4`
//     console.log();
// }, 1000);

setTimeout(function () {
  console.log('\033[2J');
  //if(usegui) printGUI();
   setInterval(function() {
      // for (var i = 0; i < 10; i++) {

        process.stdout.cursorTo(0,-1);  // move cursor to beginning of line
        process.stdout.clearLine();  // clear current text
      //  }
       if(usegui) printGUI();

   }, 500);
},3000)


// var i = 0;  // dots counter
// setInterval(function() {
//   process.stdout.clearLine();  // clear current text
//   process.stdout.cursorTo(0);  // move cursor to beginning of line
//   i = (i + 1) % 4;
//   var dots = new Array(i + 1).join(".");
//   process.stdout.write("Waiting" + dots);  // write text
// }, 300);

// setTimeout(function (){
//   printGUI();
// },500)


drone.connect(function() {
  connected = true;
  drone.MediaStreaming.videoEnable(1);

  drone.GPSSettings.resetHome();

  drone.on("ready", function() {
    state = "ready";
  });

  drone.on("flying", function(derp){
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

  drone.on("takingOff", function(){
    state = "takingOff";
  });

  drone.on("battery", function(status){
    battery = status + "%";
  });

  drone.on("HomeChanged", function(pos){
    h_altitude = pos.altitude;
    h_longitude = pos.longitude;
    h_latitude = pos.latitude;
  });

  drone.on("NumberOfSatelliteChanged", function(num){
    satellites = num.numberOfSatellite;
  });

  /*drone.on("AltitudeChanged", function(altitude){
    //console.log("Altitude: " + altitude.class);
  });

  drone.on("LongitudeChanged", function(longitude){
    console.log("Longitude: " + longitude);
  });*/

  //drone.on("GPSFixStateChanged", function(pos){
  //  console.log(pos);
  //});

  drone.on("PositionChanged", function(pos){
    //console.log(pos);
    altitude = pos.altitude;
    longitude = pos.longitude;
    latitude = pos.latitude;


	if(!((h_longitude==0)&&(h_latitude==0))){

		var lastDistanceFromHome = currentDistanceFromHome
		currentDistanceFromHome = distanceCalc.getDistanceInMeter(h_latitude, h_longitude, latitude, longitude);

		//isOutOfArea = distanceCalc.isDroneOutOfArea(49.00001, 9.00001, 49.00002, 9.00002, areaRadiusInMeter);
		var wasOutOfArea = isOutOfArea;
		isOutOfArea = (currentDistanceFromHome > areaRadiusInMeter);

		OutOfAreaContextState="unknown";


		if(isOutOfArea){
			if(wasOutOfArea){
				if(Math.abs(lastDistanceFromHome - currentDistanceFromHome) > 1 ){ //erst nach einer Mindestbewegung prüfen in welche Richtung die Drohne fliegt
					if(currentDistanceFromHome > lastDistanceFromHome){ //Drohne entfernt sich weiter vom Home-Punkt
						console.log("Drone is out of Area")
						OutOfAreaContextState="entfernt_sich_weiter";
						//drone.stop();
					}else{
						OutOfAreaContextState="fliegt_richtung_home";
					}
				}else{
					//OutOfAreaContextState="geringe Bewegung";
				}

			}else{
				console.log("Drone leaves Area")
				OutOfAreaContextState="hat_Bereich_verlassen";
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

function printGUI(){




  if(usegui){


    //var clear = require("cli-clear");

    //clear();
    //console.log('\033[2J');

    console.table([
    {
      State: 'Is Connected: ',
      CurrentValue: String(connected)
    }, {
      State: 'Balance Board Connected: ',
      CurrentValue: boardConnected
    }, {
      State: 'Balance Board Activated: ',
      CurrentValue: boardActivated
    }, {
      State: 'Drohnestatus: ',
      CurrentValue: state
    }, {
      State: 'Battery: ',
      CurrentValue: battery
    }, {
      State: 'Satellites: ',
      CurrentValue: satellites
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
    }, {
      State: 'DistanceFromHome: ',
      CurrentValue: currentDistanceFromHome
    }, {
      State: 'OutOfArea: ',
      CurrentValue: isOutOfArea
    }, {
      State: 'OutOfAreaContextState: ',
      CurrentValue: OutOfAreaContextState
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
  },

  setBoardConnected: function(val){
    boardConnected = val;
  },

  setBoardActivated: function(val){
    boardActivated = val;
  }

};
