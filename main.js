var stream = false;
var gui = true;
var log = false;

var Drone = require('./drone');
var Table = require('console.table');
var r = Drone.getAndActivateDrone();

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
    case "-v":
    case "--verbose":
      log = true;
    case "--no-ui":
      gui = false;
    default:
    return 0;
  }
});


setInterval(function() {
//DEFAULT: start xbox with ui without log + no stream
if(!Drone.isConnected()){
  console.log("No Drone-Connection");
}else{

  if(gui) Drone.useGUI(true);

  var xbox = require('./xbox');
  if (log) {
    xbox.log_level(true);
  }
  else {
    xbox.log_level(false);
  }

  if(stream) var MJpegStream = require('./mjpeg');

}
  }, 2000);

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
      DESCRIPTION: 'Streams MJpeg from drone'
    },
    {
      OPTION: '-v',
      OPTION2: '--verbose',
      DESCRIPTION: 'Prints debug log on stdout'
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
