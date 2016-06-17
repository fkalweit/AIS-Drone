var log = require('./logger').createLogger('Xbox');
var Drone = require('./drone');
var Gamepad = require("gamepad");
var Board = require('./balanceboard');
var Main = require('./main');


console.log(Main.controllerActivated);
//var r = Drone.getAndActivateDrone();

//Drone.useGUI(true);
//r.MediaStreaming.videoEnable(1);

//var fs = require("fs");
var net = require('net');
var split = require('split');
var mjpgStream = false;

// Initialize the library
Gamepad.init();

// List the state of all currently attached devices
for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
  log.debug(i, Gamepad.deviceAtIndex());
}

// Create a game loop and poll for events
setInterval(Gamepad.processEvents, 16);
// Scan for new Gamepads as a slower rate
setInterval(Gamepad.detectDevices, 500);


if (!Drone.isConnected()) {
  log.fatal("No Drone-Connection");
}

// Listen for move events on all Gamepads
Gamepad.on("move", function(id, axis, value) {
  if (Main.controllerActivated) {
  if (!Drone.isConnected()) {
    log.fatal("No Drone-Connection");
  } else {
    switch (axis) {
      case 0:
        if (value > 0.15) {
          value = Math.round(value * 100);
          log.debug("moving right by: " + value);
          r.right(value);
        } else if (value < -0.15) {
          value = Math.round(value * -100);
          log.debug("moving left by: " + value);
          r.left(value);
        }
        break;
      case 1:
        if (value > 0.15) {
          value = Math.round(value * 100);
          log.debug("moving backward by: " + value);
          r.backward(value);
        } else if (value < -0.15) {
          value = Math.round(value * -100);
          log.debug("moving forward by: " + value);
          r.forward(value);
        }
        break;
      case 2:
        value = Math.round((value * 50) + 50);
        log.debug("lifting up by: " + value);
        r.up(value);
        break;
      case 5:
        value = Math.round((value * 50) + 50);
        log.debug("sinking down by: " + value);
        r.down(value);
        break;
      default:
        {}
    }
  }

  /*console.log("move", {
  id: id,
  axis: axis,
  value: value,
});*/
}
});

// Listen for button up events on all Gamepads
Gamepad.on("down", function(id, num) {
  if (Main.controllerActivated) {
    if (!Drone.isConnected()) {
      log.fatal("No Drone-Connection");
    } else {
      try {
        switch (num) {
          case 0:
            log.debug("takeoff!");
            r.takeOff();
            break;
          case 1:
            log.debug("reset Home to current Position");
            Drone.setCurrentPositionToHome();
            break;
          case 2:
            log.debug("hovering...");
            r.stop();
            break;
          case 3:
            log.debug("landing...");
            r.land();
            break;
          case 4:
            log.debug("counterclockwise -> 30");
            r.counterClockwise(30);
            break;
          case 5:
            log.debug("clockwise -> 30");
            r.clockwise(30);
            break;
          case 6:
            log.debug("returning Home...home...sweet home");
            r.Piloting.navigateHome(1);
            break;
          case 7:
            log.debug("aborted flying home...");
            r.Piloting.navigateHome(0);
            break;
          case 8:
            log.debug("EMERGENCY!");
            r.emergency();
            break;
          case 9:
            Board.enableBoard();
            log.debug("Balance Board Aktiviert");
            break;
          case 10:
            log.debug("Balance Board Deaktiviert");
            Board.disableBoard();
            r.stop();
            log.debug("Hovering...");
            break;
          default:
            r.land();
        }
      } catch (e) {
        r.land();
        log.error("Landing because of Exception");
      }
    }

    console.log("up", {
      id: id,
      num: num,
    });
  }
});

Gamepad.on("up", function(id, num) {
  if (Main.controllerActivated) {
  if (!Drone.isConnected()) {
    log.fatal("No Drone-Connection");
  } else {
    try {
      switch (num) {
        case 4:
          log.debug("counterclockwise -> 0");
          r.counterClockwise(0);
          break;
        case 5:
          log.debug("clockwise -> 0");
          r.clockwise(0);
          break;
        default:
          //r.land();
      }
    } catch (e) {
      r.land();
      log.debug("Landing because of Exception");
    }
  }
}
});

Gamepad.on("remove", function(id, num) {
  if (Main.controllerActivated) {
  if (!Drone.isConnected()) {
    log.fatal("No Drone-Connection");
  } else {
    try {
      log.debug("Landing ... no Controller");
      console.log("STOPPPPPPPPPPPPPP");
      r.land();
    } catch (e) {
      r.land();
      log.debug("Landing because of Exception");
    }
  }
}
});


setTimeout(function() {
  if (mjpgStream) {
    console.log(mjpgStream);
    var cv = require("opencv");

    var mjpg = r.getMjpegStream(),
      buf = null,
      w = new cv.NamedWindow("Video", 0);

    mjpg.on("data", function(data) {
      buf = data;
    });

    setInterval(function() {
      if (buf == null) {
        return;
      }

      try {
        cv.readImage(buf, function(err, im) {
          if (err) {
            log.error(err);
          } else {
            if (im.width() < 1 || im.height() < 1) {
              log.info("no width or height");
              return;
            }
            w.show(im);
            w.blockingWaitKey(0, 50);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }, 80);
  }
}, 1000);
// Listen for button down events on all Gamepads
Gamepad.on("down", function(id, num) {
  if (Main.controllerActivated) {
  console.log("down", {
    id: id,
    num: num,
  });
}
});

module.exports = {
  start_stream: function(value) {
    log.info("start stream");
    mjpgStream = value;
  },
  setDrone: function(value) {
    r = value;
  }
};
