
/* Ermöglicht Zugriff auf den Drohnenroboter.
Dieser ist der Einfachheit halber immer mit 'r' benannt.
Drohne ist also d.drone
*/
var Drone = require('./drone');
var r = Drone.getAndActivateDrone();

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

// Listen for move events on all gamepads
gamepad.on("move", function (id, axis, value) {
  switch(axis){
    case 0:
    if(value > 0.01){
      value = Math.round(value * 100);
      console.log("moving right by: " + value);
      r.drone.right(value);
    }else if(value < -0.01){
      value = Math.round(value * -100);
      console.log("moving left by: " + value);
      r.drone.left(value);
    }else{
      //r.drone.hover();
    }
    break;
    case 1:
    if(value > 0.01){
      value = Math.round(value * 100);
      console.log("moving backward by: " + value);
      r.drone.backward(value);
    }else if(value < -0.01){
      value = Math.round(value * -100);
      console.log("moving forward by: " + value);
      r.drone.forward(value);
    }else{
      //r.drone.stop();
    }
    break;

    case 2:
    if(value > 0.01){
      value = Math.round(value * 100);
      console.log("sinking down by: " + value);
      r.drone.down(value);
    }else if(value < -0.01){
      value = Math.round(value * -100);
      console.log("lifting up by: " + value);
      r.drone.forward(value);
    }else{
      //r.drone.stop();
    }
    break;
    default: {}
  }

/*  console.log("move", {
    id: id,
    axis: axis,
    value: value,
  }); */
});

// Listen for button up events on all gamepads
gamepad.on("up", function (id, num) {

  switch(num) {
    case 0:
    console.log("takeoff!");
    r.drone.takeOff();
    break;
    case 1:
    console.log("hovering...");
    r.drone.stop();
    break;
    case 2:
    console.log("landing...");
    r.drone.land();
    break;
    default:
    r.drone.emergency();
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
