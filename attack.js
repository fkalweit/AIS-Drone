var Drone = require('./drone');
var log = require('./logger').createLogger('Attack');
var r = Drone.getAndActivateDrone();

var fs = require("fs");

var Main = require('./main');
var Gamepad = require("gamepad");

var connected = false;

module.exports = {
  isConnected: function() {
    return connected;
  },
  setDrone: function(value) {
    r = value;
  }
}

Gamepad.on("attach", function(id, state) {
  if (checkIfAttack(id)) {
    connected = true;
  }
});

// Initialize the library
Gamepad.init();

// List the state of all currently attached devices
for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
  log.debug(i, Gamepad.deviceAtIndex(i));
}

// Create a game loop and poll for events
setInterval(Gamepad.processEvents, 16);
// Scan for new Gamepads as a slower rate
setInterval(Gamepad.detectDevices, 500);


if (!Drone.isConnected()) {
  log.fatal("No Drone-Connection");
} else {

}


// Listen for move events on all Gamepads
Gamepad.on("move", function(id, axis, value) {
  if (connected && checkIfAttack(id)) {
    if (Main.isJoystickActivated()) {

      if (!Drone.isConnected()) {
        log.fatal("No Drone-Connection");
      } else {
        switch (axis) {
          case 0:
            if (value > 0.01) {
              value = Math.round(value * 100);
              log.debug("moving right by: " + value);
              log.debug(value);
            } else if (value < -0.01) {
              value = Math.round(value * -100);
              log.debug("moving left by: " + value);
              r.left(value);
            } else {
              //r.drone.hover();
            }
            break;
          case 1:
            if (value > 0.01) {
              value = Math.round(value * 100);
              log.debug("moving backward by: " + value);
              r.backward(value);
            } else if (value < -0.01) {
              value = Math.round(value * -100);
              log.debug("moving forward by: " + value);
              r.forward(value);
            } else {
              //r.drone.stop();
            }
            break;
          default:
            {}
        }
      }
    }
  }
});

// Listen for button up events on all Gamepads
Gamepad.on("down", function(id, num) {
  if (connected && checkIfAttack(id)) {
    if (!Drone.isConnected()) {
      console.fatal("No Drone-Connection");
    } else {
      try {
        switch (num) {
          case 0:
            log.debug("hovering...");
            r.stop();
            break;
          case 1:
            //TODO ?????
            log.debug("down...");
            r.down(50);
            break;
          case 2:
            log.debug("up...");
            r.up(50);
            break;
          case 3:
            log.debug("counterclockwise -> 20");
            r.counterClockwise(50);
            break;
          case 4:
            log.debug("clockwise -> 20");
            r.clockwise(50);
            break;
          case 5:
            log.info("landing!");
            r.land();
            if (Main.getRaceStatus()) {
              Main.stopTakeTime();
            }
            break;
          case 6:
            log.info("take off!");
            r.takeoff();
            if (Main.getRaceStatus()) {
              Main.startTakeTime(1);
            }
            break;
          case 7:
            log.debug("taking picture");
            r.takePicture();
            break;
          case 8:
            log.debug("Video...");
            Drone.toggleVideoRecording();
            break;
          case 9:
            log.debug("back flip...");
            r.backflip();
            break;
          case 10:
            log.debug("front flip...");
            r.frontflip();
            break
          default:
            r.stop();
        }
      } catch (e) {
        r.land();
        log.error("Landing because of Exception");
      }
    }
  }
});

function checkIfAttack(id) {
  for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
    if (Gamepad.deviceAtIndex(i)["deviceID"] == id) {
      if (Gamepad.deviceAtIndex(i)["vendorID"] == 1133 && Gamepad.deviceAtIndex(i)["productID"] == 49684) {
        return true;
      }
    }
  }
  return false;
}

Gamepad.on("remove", function(id, num) {

  connected = false;
  for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
    if (Gamepad.deviceAtIndex(i)["vendorID"] == 1133 && Gamepad.deviceAtIndex(i)["productID"] == 49684) {
      connected = true;
    }
  }
  for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
    log.debug(i, Gamepad.deviceAtIndex(i));
  }
  log.debug(Gamepad.numDevices());
  if (!connected && Main.isJoystickActivated()) {
    Main.setJoystickActivated(false);
    if (!Drone.isConnected()) {
      log.fatal("No Drone-Connection");
    } else {
      try {
        log.debug("Hovering ... no Controller");
        //console.log("STOPPPPPPPPPPPPPP");
        //r.land();
        r.stop();
      } catch (e) {
        r.stop();
        log.debug("hovering because of Exception");
      }
    }
  }
});
// Listen for button down events on all Gamepads
Gamepad.on("up", function(id, num) {
  if (checkIfAttack(id)) {
    if (!Drone.isConnected()) {
      console.fatal("No Drone-Connection");
    } else {
      try {
        //TODO ?????
        switch (num) {
          case 1:
            r.down(0);
            break;
          case 2:
            r.up(0);
            break;
          case 3:
            log.debug("counterclockwise -> 0");
            r.counterClockwise(0);
            break;
          case 4:
            log.debug("clockwise -> 0");
            r.clockwise(0);
            break;
          default:
            {}
        }
      } catch (e) {
        r.land();
        log.error("Landing because of Exception");
      }
    }
  }
});
