var stream = false;
var log = false;

var loglevel = 30;
var withgui = true;

var controllerActivated = false;
var balanceBoardActivated = false;
var joystickActivated = false;

var geofencingradius = 10;

//Race Mode
var playernumber = 1;
var currentDevice = "n";
var deviceNames = ['Controller', 'Joystick','Balance Board'];
var raceModeActive = false;
var currently_racing = false;

var Table = require('console.table');
var os = require('os');
var log = require('./logger').createLogger('Main', loglevel);
var clear = require('cli-clear');

module.exports = {

    isControllerActivated: function() {
        return controllerActivated;
    },

    setControllerActivated: function(val) {
        if (Controller.isConnected()) {
            deactivateAllControllers();
            controllerActivated = val;
            if(val===true) {
              currentDevice = 0
            };
        } else {
            log.info('Controller is not connected!');
            controllerActivated = false;
        }
    },
    isJoystickActivated: function() {
        return joystickActivated;
    },

    setJoystickActivated: function(val) {
      if(Joystick.isConnected()) {
        deactivateAllControllers();
        joystickActivated = val;
        if(val===true) {
          currentDevice = 1
        };
      }  else {
          log.info('Joystick is not connected!');
          joystickActivated = false;
      }
    },
    isBalanceBoardActivated: function() {
        return balanceBoardActivated;
    },

    setBalanceBoardActivated: function(val) {
        if (BalanceBoard.isConnected()) {
            deactivateAllControllers();
            balanceBoardActivated = val;
            if(val===true) {
              currentDevice = 2
            };
        } else {
            log.info('Balance Board is not connected!');
            balanceBoardActivated = false;
        }

    },
    startRace: function(){
      raceModeActive = true;
      scores = [];
      timestamp = 0;
      times = [0,0,0,0,0];
      playernumber = 1;
      process.stdout.cursorTo(0, -1);
    },
    stopRace: function(){
      raceModeActive = false;
      clear();
    },
    getRaceStatus: function(){
        return raceModeActive;
    },
    startTakeTime: function(device){
      if(raceModeActive) {
        currentDevice = device;
        startTimeMeasure();
      } else {
        log.info('Could not start race. Race Mode is not activated')
      }
    },
    stopTakeTime: function(){
      times[currentDevice] = stopTimeMeasure();
      timestamp = 0;
    },
    abortTakeTime: function(){
      times[currentDevice] = '-1';
      timestamp = 0;
    },
    saveTime: function(){
      if(raceModeActive) {
        if(!(times[0] == 0 && times[1] == 0 && times[2] == 0)){
                            times[3] = (3 * times[0] + 2 * times[1] + 1 * times[2]);
                times[4] = playernumber;
                playernumber = playernumber + 1;
                scores.push(times);
                times = [0, 0, 0, 0, 0];
                clear();
            }
        } else {
          log.info('Could not save time. Race Mode is not activated')
        }
    },
    getTimes: function(){
      return times;
    },
    getScores: function(){
      return scores;
    },
    deactivateAll: function() {
        deactivateAllControllers();
    },
    isCurrentlyRacing: function() {
      return currently_racing;
    }
};

function deactivateAllControllers(){
  balanceBoardActivated = false;
  controllerActivated = false;
  joystickActivated = false;
}

process.argv.forEach(function(val, index, array) {
    //console.log(index + ': ' + val);   // Für Debug des switch
    if (array.length == 2) {
        return 0;
    }
    switch (val) {
        case "-?":
        case "--help":
            printHelp();
            process.exit(0);
            break;
        case "-s":
        case "--stream":
            if (os.platform() == "win32" || os.platform() == "win64") {
                log.error("Stream does not work on Windows!");
                process.exit(0);
            }
            stream = true;
            break;
        case "-v":
        case "--verbose":
            loglevel = 10;
            withgui = false;
            break;
        case "-l":
        case "--log":
            loglevel = parseInt(array[index + 1]);
            var log = require('./logger').createLogger('Main', loglevel);
            array.splice(index, 1);
            break;
          case "-m":
          case "--modus":
            raceModeAvtive = parseInt(array[index + 1]);
            array.splice(index, 1);
            break;
        case "--no-ui":
            withgui = false;
            break;
        case "-r":
        case "--geofencingradius":
               geofencingradius = parseFloat(array[index + 1]);
               array.splice(index, 1);
               break;
        default:
            if (index > 1) {
                log.error("Unknown arg.");
                process.exit(0);
            }
    }
});

// trace = 10, debug = 20, info = 30, warn = 40, error = 50, fatal = 60
// To use the Logger do:
// var logger = require('./logger').createLogger(< modul_name >, [<log_level>]);
// if no log_level is passed, the previous set will be used.
// Then u can do log.x for x € [trace, debug, info, warn, error, fatal]

var Controller = require('./xbox')

var Drone = require('./drone');
Drone.setAreaRadiusInMeter(geofencingradius);

var Controller = require('./xbox');

var Keyboard = require('./keyboard');

var Joystick = require('./attack');

var BalanceBoard = require('./balanceboard')

if (os.platform() == "win32" || os.platform() == "win64") {
  log.info("WiiRemote does not work with Windows.")
}
else {
  var spawn = require("child_process").spawn;
  var myapp = spawn('java', ['-jar', 'WiiRemoteJ.jar']);
        myapp.stdout.on('data', function (data) {
            log.debug(data.toString());
        });

        myapp.stderr.on('data', function (data) {
            log.debug(data.toString());
        });

        myapp.on('exit', function (code) {
            log.debug('child process exited with code ' + code);
        });
}


var r = Drone.getAndActivateDrone();

process.on('exit', (code) => {
  r.Network.disconnect();
  myapp.kill('SIGKILL');
  log.info("Disconnected from the drone");
  log.info('About to exit with code:', code);
});

process.on('SIGINT', function() {
  r.Network.disconnect();
  myapp.kill('SIGKILL');
  log.info(" ");
  log.info("Caught interrupt signal");
  process.exit();
});

setTimeout(function() {
      //DEFAULT: start xbox with ui without log + no stream
      if (!Drone.isConnected()) {
        log.fatal("No Drone-Connection");
        var CLI = require('clui'),
          Spinner = CLI.Spinner;

        var countdown = new Spinner('No Drone-Connection. Exiting in 10 seconds...  ');

        countdown.start();

        var number = 10;
        setInterval(function() {
          number--;
          countdown.message('No Drone-Connection. Exiting in ' + number + ' seconds...  ');
          if (number === 0) {
            process.stdout.write('\n');
            process.exit(0);
          }
        }, 1000);
    } else {

        r.MediaStreaming.videoEnable(1);

        Controller.setDrone(r);

        Keyboard.setDrone(r);

        if (stream) Controller.start_stream(true);
        //if(stream) var MJpegStream = require('./mjpeg');

        //console.log('\033[2J');
        if(withgui){
          clear();
        }
        setInterval(function() {
            if (withgui) {
                process.stdout.cursorTo(0, -1); // move cursor to beginning of line
                //process.stdout.clearLine(); // clear current text
                printGUI();

            }
        }, 200);

    }
}, 1500);

function printGUI() {
        console.log("\r\n");
        console.log("-------------------------STATUS-----------------------------");
        console.log("\r\n");
        console.table([{
            State: 'Is Connected: ',
            CurrentValue: String(Drone.isConnected())
        },
          {
              State: 'Racemode: ',
              CurrentValue: String(raceModeActive)
          },
         {
        	  State: 'Controller Connected: ',
        	  CurrentValue: Controller.isConnected()
    	  }, {
        	  State: 'Controller Activated: ',
        	  CurrentValue: controllerActivated
    	  }, {
            State: 'Joystick Connected: ',
            CurrentValue: Joystick.isConnected()
        }, {
            State: 'Joystick Activated: ',
            CurrentValue: joystickActivated
    	  }, {
            State: 'Balance Board Connected: ',
            CurrentValue: BalanceBoard.isConnected()
        }, {
            State: 'Balance Board Activated: ',
            CurrentValue: balanceBoardActivated
    	  }, {
            State: 'Drohnen Status: ',
            CurrentValue: Drone.getState()
        }, {
            State: 'Battery: ',
            CurrentValue: Drone.getBattery()
        }, {
            State: 'Satellites: ',
            CurrentValue: Drone.getSatellites()
        }, {
            State: 'GPS: ',
            H: Drone.getAltitude(),
            L: Drone.getLongitude(),
            B: Drone.getLatitude()
        }, {
            State: 'Home Position:',
            H: Drone.getHomeAltitude(),
            L: Drone.getHomeLongitude(),
            B: Drone.getHomeLatitude()
        }, {
            State: 'DistanceFromHome: ',
            CurrentValue: Drone.getCurrentDistanceFromHome()
        },
        {
            State: 'AreaRadiusInMeter: ',
            CurrentValue: Drone.getAreaRadiusInMeter()
        },
        {
            State: 'OutOfArea: ',
            CurrentValue: Drone.getOutOfArea()
        }, {
            State: 'OutOfAreaContextState: ',
            CurrentValue: Drone.getOutOfAreaContextState()
        }]);

        if(raceModeActive){

          console.log("\r\n");
          console.log("-------------------------RACEMODE-----------------------------");
          console.log("\r\n");

          console.log("")
          console.log("Active Device: "+ deviceNames[currentDevice] + "  Time: " + measureOrZero().toFixed(2));
          console.log("\r\n");

          console.table([{
            CurRun: "",
            Xbox: times[0].toFixed(2),
            Joystick: times[1].toFixed(2),
            BalanceBoard: times[2].toFixed(2)
          }]);

          scoreboard = [{Player: "", Score: "", Xbox: "", Joystick: "", BalanceBoard: "" }];

          scores.sort(function(a,b){return (a[3] - b[3]);});

          scores.forEach(function(item){
             scoreboard.push({Player: item[4], Score: item[3].toFixed(2), Xbox: item[0].toFixed(2), Joystick: item[1].toFixed(2), BalanceBoard: item[2].toFixed(2) });
          });

          console.table(scoreboard);
        }
        console.log("\r\n");
        console.log("-------------------------LOG (" + loglevel + ")-----------------------------");
        console.log("\r\n");



};


function printHelp() {

    //console.log('\033[2J'); //clear
    console.log("Call: main.js [OPTION]\n");
    console.log("Control a connected Bebop2 with Xbox-Controller.");
    console.log("https://github.com/fog1992/AIS-Drone.git");
    console.log("On default the console-ui is activated.\n");
    console.table([{
        OPTION: '-?',
        OPTION2: '--help',
        DESCRIPTION: 'Prints this table'
    }, {
        OPTION: '-r <radius>',
        OPTION2: '--geofencingradius <radius>',
        DESCRIPTION: 'Set Geofencing-Radius (in m)'
    }, {
        OPTION: '-l <level>',
        OPTION2: '--log <level>',
        DESCRIPTION: 'Set loglevel to <loglevel>'
    }, {
        OPTION: '-v',
        OPTION2: '--verbose',
        DESCRIPTION: 'Prints debug log on stdout and disables the GUI'
    }, {
        OPTION2: '--no-ui',
        DESCRIPTION: "Disables the console user interface"
    }, {
        OPTION: '-s',
        OPTION2: '--stream',
        DESCRIPTION: 'Streams MJpeg from drone (only on Unix)'
    }]);
    console.log("Assignment of keyboard keys:\n");
    console.table([{
        Button: 't',
        DESCRIPTION: 'takeoff'
    }, {
        Button: 'l',
        DESCRIPTION: 'land'
    }, {
        Button: 'space',
        DESCRIPTION: 'emergency'
    }, {
        Button: 'w',
        DESCRIPTION: 'move forward'
    }, {
        Button: 's',
        DESCRIPTION: 'move backward'
    }, {
        Button: 'a',
        DESCRIPTION: 'move left'
    }, {
        Button: 'd',
        DESCRIPTION: 'move right'
    }, {
        Button: 'e',
        DESCRIPTION: 'rise'
    }, {
        Button: 'q',
        DESCRIPTION: 'sink'
    }, {
        Button: '1',
        DESCRIPTION: 'activate/deactivate gamepad'
    }, {
        Button: '2',
        DESCRIPTION: 'activate/deactivate joystick'
    }, {
        Button: '3',
        DESCRIPTION: 'activate/deactivate balance board'
    }, {
        Button: '4',
        DESCRIPTION: 'Start race with controller'
    }, {
        Button: '5',
        DESCRIPTION: 'Start race with joystick'
    }, {
       Button: '6',
       DESCRIPTION: 'Start race with balance board'
   },
    {
        Button: 'left',
        DESCRIPTION: 'counterclockwise'
    }, {
        Button: 'right',
        DESCRIPTION: 'clockwise'
    }, {
        Button: 'end',
        DESCRIPTION: 'quit programm'
    }]);
    console.log("\n");

    console.log("Assignment of controller keys:\n");
    console.table([{
        Button: 'XBOX',
        DESCRIPTION: 'emergency'
    }, {
        Button: 'back',
        DESCRIPTION: 'return to home'
    }, {
        Button: 'start',
        DESCRIPTION: ''
    }, {
        Button: 'A',
        DESCRIPTION: 'takeoff'
    }, {
        Button: 'B',
        DESCRIPTION: 'reset home'
    }, {
        Button: 'X',
        DESCRIPTION: 'hovering'
    }, {
        Button: 'Y',
        DESCRIPTION: 'landing'
    }, {
        Button: 'LB',
        DESCRIPTION: 'counterclockwise'
    }, {
        Button: 'RB',
        DESCRIPTION: 'clockwise'
    }, {
        Button: 'LT',
        DESCRIPTION: 'rise'
    }, {
        Button: 'RT',
        DESCRIPTION: 'sink'
    }, {
        Button: 'press left stick',
        DESCRIPTION: 'activate balance board'
    }, {
        Button: 'press right stick',
        DESCRIPTION: 'deactivate balance board'
    }]);
    console.log("\n");

};

function startRace(){
  raceModeActive = true;
};

var timestamp;

function startTimeMeasure(){
  currently_racing = true;
  timestamp = Date.now();
};

function stopTimeMeasure(){
  if(currently_racing) {
    currently_racing = false;
    return (Date.now() - timestamp) / 1000;
  }
};

function measureOrZero(){
  if (timestamp == 0){
    return 0;
  }else{
    return (Date.now() - timestamp) / 1000;
  }
};

var times = [0, 0, 0, 0];
var scores = [];

//module.exports.controllerActivated = controllerActivated;

// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Funktionen in anderen Modulen.
