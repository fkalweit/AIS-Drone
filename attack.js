/*
WARNUNG !!!!!!!!
NICHT MIT DEM XBOX-CONTROLLER AUSFÜHREN!!!
DORT IST DIE LINKE SCHULTERTASTE EINE ACHSE...
EINMAL DRAUFGEDRÜCKT UND DIE DROHNE STEIGT PERMAMENT... UNAUFHALTSAM...
*/


/* Ermöglicht Zugriff auf den Drohnenroboter.
Dieser ist der Einfachheit halber immer mit 'r' benannt.
Drohne ist also d.drone
*/
var Drone = require('./drone');
var r = Drone.getAndActivateDrone();
r.MediaStreaming.videoEnable(1);

var fs = require("fs"),

var output = fs.createWriteStream("./video.h264");
var video = r.getVideoStream();

var gamepad = require("gamepad");

// Initialize the library
gamepad.init()

// List the state of all currently attached devices
for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
  console.log(i, gamepad.deviceAtIndex());
}

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);


if(!Drone.isConnected()){
  console.log("No Drone-Connection");
}


// Listen for move events on all gamepads
gamepad.on("move", function (id, axis, value) {
  if(!Drone.isConnected()){
    console.log("No Drone-Connection");
  }else{
    switch(axis){
      case 0:
      if(value > 0.01){
        value = Math.round(value * 100);
        console.log("moving right by: " + value);
        r.right(value);
      }else if(value < -0.01){
        value = Math.round(value * -100);
        console.log("moving left by: " + value);
        r.left(value);
      }else{
        //r.drone.hover();
      }
      break;
      case 1:
      if(value > 0.01){
        value = Math.round(value * 100);
        console.log("moving backward by: " + value);
        r.backward(value);
      }else if(value < -0.01){
        value = Math.round(value * -100);
        console.log("moving forward by: " + value);
        r.forward(value);
      }else{
        //r.drone.stop();
      }
      break;

      case 2:
      if(value > 0.01){
        value = Math.round(value * 100);
        console.log("sinking down by: " + value);
        r.down(value);
      }else if(value < -0.01){
        value = Math.round(value * -100);
        console.log("lifting up by: " + value);
        r.up(value);
      }else{
        //r.drone.stop();
      }
      break;
      default: {}
    }
  }

  /*  console.log("move", {
  id: id,
  axis: axis,
  value: value,
}); */
});

// Listen for button up events on all gamepads
gamepad.on("down", function (id, num) {
  if(!Drone.isConnected()){
    console.log("No Drone-Connection");
  }else{
    try{
      switch(num) {
        case 0:
        console.log("takeoff!");
        r.takeOff();
        break;
        case 1:
        console.log("hovering...");
        r.stop();
        break;
        case 2:
        console.log("landing...");
        r.land();
        break;
        case 3:
        console.log("clockwise -> 20");
        r.clockwise(20);
        break;
        case 4:
        console.log("counterclockwise -> 20");
        r.counterClockwise(20);
        break;
        case 5:
        console.log("taking picture");
        r.takePicture();
        break;
        case 6:
        console.log("EMERGENCY!");
        r.emergency();
        break;
        case 7:
        console.log("frontflip...");
        r.frontFlip();
        break;
        case 8:
        console.log("backflip...");
        r.backFlip();
        break;
        case 9:
        console.log("startRecording...");
        r.startRecording();
        break;
        case 10:
        console.log("stopRecording...");
        r.stopRecording();
        break;
        default:
        r.emergency();
      }
    }catch (e){
      r.land();
    }
  }

  console.log("up", {
    id: id,
    num: num,
  });
});

// Listen for button down events on all gamepads
gamepad.on("down", function (id, num) {
  console.log("down", {
    id: id,
    num: num,
  });
});
