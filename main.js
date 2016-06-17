var stream = false;
var log = false;

var loglevel = 20;
var withgui = true;

var controllerActivated = false;
var balanceBoardActivated = false;
var joystickActivated = false;

var raceModeAvtive = false;

var boardConnected = false;

var Table = require('console.table');
var os = require('os');
var log = require('./logger').createLogger('Main', loglevel);



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

var Drone = require('./drone');

var Keyboard = require('./keyboard');

var Controller = require('./xbox')

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

        console.log('\033[2J');
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
        console.table([{
            State: 'Is Connected: ',
            CurrentValue: String(Drone.isConnected())
        }, {
            State: 'Balance Board Connected: ',
            CurrentValue: boardConnected
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
        }, {
            State: 'OutOfArea: ',
            CurrentValue: Drone.getOutOfArea()
        }, {
            State: 'OutOfAreaContextState: ',
            CurrentValue: Drone.getOutOfAreaContextState()
        }]);

        console.log("\r\n");
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

module.exports.controllerActivated = controllerActivated;

// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Funktionen in anderen Modulen.
module.exports = {

  // evtl. Variablen direkt im Export


    getControllerActivated: function() {
        return controllerActivated;
    },
    setControllerActivated: function(val) {
        controllerActivated = val;
    },
    getBalanceBoardActivated: function() {
        return balanceBoardActivated;
    },
    setBalanceBoardActivated: function(val) {
        balanceBoardActivated = val;
    },
    getJoystickActivated: function() {
        return joystickActivated;
    },
    setJoystickActivated: function(val) {
        joystickActivated = val;
    }
}
