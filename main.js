var stream = false;

var Drone = require('./drone');
var r = Drone.getAndActivateDrone();

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
  switch (val) {
    case "-h":
    case "--help":
        console.log("Call 'main.js' to fly the drone with xbox-controller.");
        console.log("Call 'main.js --stream OR -s' to get a MJPEG-Stream.");
      break;
    case "-s":
    case "--stream":
      stream = true;
    default:
  }
});

if(!Drone.isConnected()){
  console.log("No Drone-Connection");
}else{
  var xbox = require('./xbox');
  if(stream){
    var MJpegStream = require('./mjpeg');
  }
}
