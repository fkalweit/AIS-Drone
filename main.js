var stream = false;
var log = false;

var loglevel = 20;
var withgui = true;

var controllerActivated = false;
var balanceBoardActivated = false;
var joystickActivated = false;

var raceModeActive = false;
var playernumber = 1;
var currentDevice = "n";

var boardConnected = false;

var Table = require('console.table');
var os = require('os');
var log = require('./logger').createLogger('Main', loglevel);
var clear = require('cli-clear');

var geofencingradius = 10;


module.exports = {

    isControllerActivated: function() {
        return controllerActivated;
    },

    setControllerActivated: function(val) {
        if (Controller.isConnected()) {
            controllerActivated = val;
        } else {
            log.info('Controller is not connected!');
            controllerActivated = false;
        }
    },

    isBalanceBoardActivated: function() {
        return balanceBoardActivated;
    },

    setBalanceBoardActivated: function(val) {
        if (BalanceBoard.isConnected()) {
            balanceBoardActivated = val;
        } else {
            log.info('Balance Board is not connected!');
            balanceBoardActivated = false;
        }

    },

    isJoystickActivated: function() {
        return joystickActivated;
    },

    setJoystickActivated: function(val) {
        joystickActivated = val;
    },
    startRace: function(){
        raceModeActive = true;
        scores = [];
        timestamp = 0;
        times = [0,0,0,0,0];
        playernumber = 1;
        clear();
    },
    stopRace: function(){
        raceModeActive = false;
        clear();
    },
    getRaceStatus: function(){
        return raceModeActive;
    },
    startTakeTime: function(device){
      currentDevice = device;
      startTimeMeasure();
    },
    stopTakeTime: function(){
      times[currentDevice] = stopTimeMeasure();
      timestamp = 0;
    },
    saveTime: function(){
      if(!(times[0] == 0 && times[1] == 0 && times[2] == 0)){
        times[3] = (3 * times[0] + 2 * times[1] + 1 * times[2]);
        times[4] = playernumber;
        playernumber = playernumber + 1;
        scores.push(times);
        times = [0, 0, 0, 0, 0];
        clear();
      }
    },
    getTimes: function(){
      return times;
    },
    getScores: function(){
      return scores;
    },

    deactivateAll: function() {
        balanceBoardActivated = false;
        controllerActivated = false;
        joystickActivated = false;
    }
};



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
            geofencingradius = parseInt(array[index + 1]);
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

var Keyboard = require('./keyboard');

var Controller = require('./xbox');
var BalanceBoard = require('./balanceboard')

var Joystick = require('./attack');

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
  console.log("Disconnected from the drone");
  console.log('About to exit with code:', code);
});

process.on('SIGINT', function() {
  r.Network.disconnect();
  myapp.kill('SIGKILL');
  console.log(" ");
  console.log("Caught interrupt signal");
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

        if(withgui){
          clear();
        }
        setInterval(function() {
            if (withgui) {
                process.stdout.cursorTo(0, -1); // move cursor to beginning of line
                process.stdout.clearLine(); // clear current text
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
            State: 'Balance Board Connected: ',
            CurrentValue: BalanceBoard.isConnected()
        }, {
            State: 'Balance Board Activated: ',
            CurrentValue: balanceBoardActivated
    	}, {
        	State: 'Controller Connected: ',
        	CurrentValue: Controller.isConnected()
    	}, {
        	State: 'Controller Activated: ',
        	CurrentValue: controllerActivated
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
        }, {
            State: 'AreaRadiusInMeter: ',
            CurrentValue: Drone.getAreaRadiusInMeter()
        }, {
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
        console.log("Device: "+ currentDevice + " CurrentMeasure: " + measureOrZero().toFixed(2));
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
    console.log("Controle a connected Bebop2 with Xbox-Controller.");
    console.log("https://github.com/fog1992/AIS-Drone.git");
    console.log("On default the console-ui is activated.\n");
    console.table([{
        OPTION: '-?',
        OPTION2: '--help',
        DESCRIPTION: 'Prints this table'
    }, {
        OPTION: '-s',
        OPTION2: '--stream',
        DESCRIPTION: 'Streams MJpeg from drone (only on Unix)'
    }, {
        OPTION: '-v',
        OPTION2: '--verbose',
        DESCRIPTION: 'Prints debug log on stdout and disables the GUI'
    }, {
        OPTION: '-l <level>',
        OPTION2: '--log <level>',
        DESCRIPTION: 'Set loglevel to <loglevel>'
    }, {
        OPTION2: '--no-ui',
        DESCRIPTION: "Disables the console user interface"
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
        DESCRIPTION: 'activate/deactivate balance board'
    }, {
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
}

var timestamp;

function startTimeMeasure(){
  timestamp = Date.now();
}

function stopTimeMeasure(){
  return (Date.now() - timestamp) / 1000;
}

function measureOrZero(){
  if (timestamp == 0){
    return 0;
  }else{
    return (Date.now() - timestamp) / 1000;
  }
}

var times = [0, 0, 0, 0];
var scores = [];

//module.exports.controllerActivated = controllerActivated;

// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Funktionen in anderen Modulen.
