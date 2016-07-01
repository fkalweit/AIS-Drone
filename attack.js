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
var log = require('./logger').createLogger('Attack');
var r = Drone.getAndActivateDrone();
//r.MediaStreaming.videoEnable(1);

var fs = require("fs");

var Main = require('./main');
var gamepad = require("gamepad");

var connected = false;

module.exports = {
  isConnected: function() {
      return connected;
  },
  setDrone: function(value) {
    r = value;
  }
}


// Initialize the library
gamepad.init();

// List the state of all currently attached devices
for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
  log.debug(i, gamepad.deviceAtIndex(i));
}

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);

//while(!Drone.isConnected()){

//}


if(!Drone.isConnected()){
  log.fatal("No Drone-Connection");
}else{

}


// Listen for move events on all gamepads
gamepad.on("move", function (id, axis, value) {
  if(checkIfAttack(id)){
  if(!Drone.isConnected()){
    log.fatal("No Drone-Connection");
  }else{
    switch(axis){
      case 0:
      if(value > 0.01){
        value = Math.round(value * 100);
        log.debug("moving right by: " + value);
        log.debug(value);
      }else if(value < -0.01){
        value = Math.round(value * -100);
        log.debug("moving left by: " + value);
        r.left(value);
      }else{
        //r.drone.hover();
      }
      break;
      case 1:
      if(value > 0.01){
        value = Math.round(value * 100);
        log.debug("moving backward by: " + value);
        r.backward(value);
      }else if(value < -0.01){
        value = Math.round(value * -100);
        log.debug("moving forward by: " + value);
        r.forward(value);
      }else{
        //r.drone.stop();
      }
      break;

      case 2:
      if(value > 0.01){
        value = Math.round(value * 100);
        log.debug("sinking down by: " + value);
        r.down(value);
      }else if(value < -0.01){
        value = Math.round(value * -100);
        log.debug("lifting up by: " + value);
        r.up(value);
      }else{
        //r.drone.stop();
      }
      break;
      default: {}
    }
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
  if(checkIfAttack(id)){
  if(!Drone.isConnected()){
    console.fatal("No Drone-Connection");
  }else{
    try{
      switch(num) {
        case 0:
        log.debug("takeoff!");
        r.takeOff();
        if(Main.getRaceStatus()){
          Main.startTakeTime(1);
        }
        break;
        case 1:
        log.debug("hovering...");
        r.stop();
        break;
        case 2:
        log.debug("landing...");
        r.land();
        if(Main.getRaceStatus()){
          Main.stopTakeTime();
        }
        break;
        case 3:
        log.debug("clockwise -> 20");
        r.clockwise(20);
        break;
        case 4:
        log.debug("counterclockwise -> 20");
        r.counterClockwise(20);
        break;
        case 5:
        log.debug("taking picture");
        r.takePicture();
        break;
        case 6:
        log.debug("EMERGENCY!");
        r.emergency();
        break;
        case 7:
        log.debug("frontflip...");
        r.frontFlip();
        break;
        case 8:
        log.debug("backflip...");
        r.backFlip();
        break;
        case 9:
        log.debug("startRecording...");
        r.startRecording();
        break;
        case 10:
        log.debug("stopRecording...");
        r.stopRecording();
        break;
        default:
        r.emergency();
      }
    }catch (e){
      r.land();
      log.error("Landing because of Exception");
    }
  }
}
});

function checkIfAttack(id){
  for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
    if(gamepad.deviceAtIndex(i)["deviceID"] == id){
      if(gamepad.deviceAtIndex(i)["vendorID"] == 1133 && gamepad.deviceAtIndex(i)["productID"] == 49684){
        return true;
      }
    }
  }
  return false;
}

// Listen for button down events on all gamepads
gamepad.on("down", function (id, num) {
  if(checkIfAttack(id)){
  log.debug("down", {
    id: id,
    num: num,
  });
}
});
