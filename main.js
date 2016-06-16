var stream = false;
var gui = true;
var log = false;

var loglevel = 20;
var withgui = true;

var Table = require('console.table');

process.argv.forEach(function (val, index, array) {
  //console.log(index + ': ' + val);   // Für Debug des switch
  switch (val) {
    case "-h":
    case "--help":
        printHelp();
        process.exit(0);
      break;
    case "-s":
    case "--stream":
      stream = true;
      break;
    case "-v":
    case "--verbose":
      loglevel = 10;
      withgui = false;
      break;
    case "--no-ui":
      withgui = false;
      break;
    default:
    return 0;
  }
});


// trace = 10, debug = 20, info = 30, warn = 40, error = 50, fatal = 60
// To use the Logger do:
// var logger = require('./logger').createLogger(< modul_name >, [<log_level>]);
// if no log_level is passed, the previous set will be used.
// Then u can do log.x for x € [trace, debug, info, warn, error, fatal]
var log = require('./logger').createLogger('Main', loglevel);

var Drone = require('./drone');

var r = Drone.getAndActivateDrone();

setTimeout(function() {
  //DEFAULT: start xbox with ui without log + no stream
  if(!Drone.isConnected()){
    log.fatal("No Drone-Connection");
  }else{

    r.MediaStreaming.videoEnable(1);
    
    Drone.useGUI(withgui);

    var Controller = require('./xbox');

    var Keyboard = require('./keyboard');

    if(stream) Controller.start_stream(true);
    //if(stream) var MJpegStream = require('./mjpeg');
  }
}, 1500);

function printHelp(){

    //console.log('\033[2J'); //clear
    console.log("Call: main.js [OPTION]\n");
    console.log("Controle a connected Bebop2 with Xbox-Controller.");
    console.log("On default the console-ui is activated.\n");
    console.table([
    {
      OPTION: '-h',
      OPTION2: '--help',
      DESCRIPTION: 'Prints this table'
    },
    {
      OPTION: '-s',
      OPTION2: '--stream',
      DESCRIPTION: 'Streams MJpeg from drone (only on Unix)'
    },
    {
      OPTION: '-v',
      OPTION2: '--verbose',
      DESCRIPTION: 'Prints debug log on stdout and disables the GUI'
    },
    {
      OPTION2: '--no-ui',
      DESCRIPTION: "Disables the console user interface"
    }
  ]);

  console.log("Assignment of controller keys:\n");
  console.table([
  {
    Button: 'XBOX',
    DESCRIPTION: 'emergency'
  },
  {
    Button: 'back',
    DESCRIPTION: 'return to home'
  },
  {
    Button: 'start',
    DESCRIPTION: ''
  },
  {
    Button: 'A',
    DESCRIPTION: 'takeoff'
  },
  {
    Button: 'B',
    DESCRIPTION: 'reset home'
  },
  {
    Button: 'X',
    DESCRIPTION: 'hovering'
  },
  {
    Button: 'Y',
    DESCRIPTION: 'landing'
  },
  {
    Button: 'LB',
    DESCRIPTION: 'counterclockwise'
  },
  {
    Button: 'RB',
    DESCRIPTION: 'clockwise'
  },
  {
    Button: 'LT',
    DESCRIPTION: 'rise'
  },
  {
    Button: 'RT',
    DESCRIPTION: 'sink'
  },
  {
    Button: 'press left stick',
    DESCRIPTION: 'activate balance board'
  },
  {
    Button: 'press right stick',
    DESCRIPTION: 'deactivate balance board'
  }
]);
    console.log("\n");

};
