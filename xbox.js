var log = require('./logger').createLogger('Xbox');
var Drone = require('./drone');
var Gamepad = require("gamepad");
var Main = require('./main');

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
    if (checkIfXbox(id)) {
        connected = true;
    }
});

// Initialize the library
Gamepad.init();

// List the state of all currently attached devices
for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
    log.debug(i, Gamepad.deviceAtIndex(i));
}
log.debug(Gamepad.numDevices());
// Create a game loop and poll for events
setInterval(Gamepad.processEvents, 16);
// Scan for new Gamepads as a slower rate
setInterval(Gamepad.detectDevices, 500);

if (!Drone.isConnected()) {
    log.fatal("No Drone-Connection");
}



const deadZoneGamepad = 0.15;
var Axis0LastValue = 0.0;
var Axis1LastValue = 0.0;
var Axis2LastValue = 0.0;
var Axis3LastValue = 0.0;
// Listen for move events on all Gamepads
Gamepad.on("move", function(id, axis, value) {
    if (connected && checkIfXbox(id)) {
        if (Main.isControllerActivated()) {
            if (!Drone.isConnected()) {
                log.fatal("No Drone-Connection");
            } else {
                switch (axis) {
                    case 0:
                        Axis0LastValue = value;
                        if (value > deadZoneGamepad) {
                            value = Math.round(value * 100);
                            log.debug("moving right by: " + value);
                            r.right(value);
                        } else if (value < -deadZoneGamepad) {
                            value = Math.round(value * -100);
                            log.debug("moving left by: " + value);
                            r.left(value);
                        }
                        break;
                    case 1:
                        Axis1LastValue = value;
                        if (value > deadZoneGamepad) {
                            value = Math.round(value * 100);
                            log.debug("moving backward by: " + value);
                            r.backward(value);
                        } else if (value < -deadZoneGamepad) {
                            value = Math.round(value * -100);
                            log.debug("moving forward by: " + value);
                            r.forward(value);
                        }
                        break;
                    case 2:
                        Axis2LastValue = value;
                        value = Math.round((value * 50) + 50);
                        log.debug("down by: " + value);
                        r.down(value);
                        break;
                    case 3:
                        Axis3LastValue = value;
                        if (value > deadZoneGamepad) {
                            value = Math.round((value * 50) + 50);
                            log.debug("clockwise: " + value);
                            r.clockwise(value);
                        } else if (value < -deadZoneGamepad) {
                            value = Math.round((value * -50) + 50);
                            log.debug("counterClockwise: " + value);
                            r.counterClockwise(value);
                        }
                        break;
                    case 5:
                        value = Math.round((value * 50) + 50);
                        log.debug("lifting up by: " + value);
                        r.up(value);
                        break;

                    default:
                        {}
                } //end switch

                //Auto-Hover wenn keine Bewegung aktiv
                if (axis == 0 || axis == 1) {
                    if ((Math.abs(Axis0LastValue) < deadZoneGamepad) && (Math.abs(Axis1LastValue) < deadZoneGamepad)) {
                        log.debug("Automatic Hover !");
                        r.stop();
                    }
                }
                if (axis == 3) {
                    if ((Math.abs(Axis3LastValue) < deadZoneGamepad)) {
                        log.debug("rotation stop!");
                        r.clockwise(0);
                        r.counterClockwise(0);
                    }
                }



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
    if (connected && checkIfXbox(id)) {
        if (Main.isControllerActivated()) {
            if (!Drone.isConnected()) {
                log.fatal("No Drone-Connection");
            } else {
                try {
                    switch (num) {
                        case 0:
                            log.debug("takeoff!");
                            r.takeOff();
                            if (Main.getRaceStatus()) {
                                Main.startTakeTime(0);
                            }
                            break;
                        case 1:
                            if (Main.getRaceStatus()) {
                                log.debug("reset Home to current Position");
                                Drone.setCurrentPositionToHome();
                            }
                            break;
                        case 2:
                            log.debug("hovering...");
                            r.stop();
                            break;
                        case 3:
                            log.debug("landing...");
                            r.land();
                            if (Main.getRaceStatus()) {
                                Main.stopTakeTime();
                            }
                            break;
                        case 4:
                            log.debug("counterclockwise -> 50");
                            r.counterClockwise(50);
                            break;
                        case 5:
                            log.debug("clockwise -> 50");
                            r.clockwise(50);
                            break;
                        case 6:
                            //log.debug("returning Home...home...sweet home");
                            //r.Piloting.navigateHome(1);
                            break;
                        case 7:
                            log.debug("TAKING PICTURE");
                            r.takePicture();
                            //log.debug("aborted flying home...");
                            //r.Piloting.navigateHome(0);
                            //Drone.toggleVideoRecording();
                            break;
                        case 8:
                            //Drone.toggleVideoRecording();
                            break;
                        case 9:
                            break;
                        case 10:
                            break;
                        case 11:
                            r.leftFlip();
                            break;
                        case 12:
                            r.rightFlip();
                            break;
                        case 13:
                            r.frontFlip();
                            break;
                        case 14:
                            r.backFlip();
                            break;
                        default:
                            r.land();
                    }
                } catch (e) {
                    r.stop();
                    log.error("Stop because of Exception");
                }
            }

            log.debug("up", {
                id: id,
                num: num,
            });
        }
    }
});

Gamepad.on("up", function(id, num) {
    if (connected && checkIfXbox(id)) {
        if (Main.isControllerActivated()) {
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
    }
});

function checkIfXbox(id) {
    for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
        if (Gamepad.deviceAtIndex(i)["deviceID"] == id) {
            if (Gamepad.deviceAtIndex(i)["vendorID"] == 1118) {
                return true;
            }
        }
    }
    return false;
}


Gamepad.on("remove", function(id, num) {

    connected = false;
    for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
        if (Gamepad.deviceAtIndex(i)["vendorID"] == 1118) {
            connected = true;
        }
    }

    for (var i = 0, l = Gamepad.numDevices(); i < l; i++) {
        log.debug(i, Gamepad.deviceAtIndex(i));
    }
    log.debug(Gamepad.numDevices());
    if (!connected && Main.isControllerActivated()) {
        Main.setControllerActivated(false);
        if (!Drone.isConnected()) {
            log.fatal("No Drone-Connection");
        } else {
            try {
                log.debug("Hovering ... no Controller");
                r.stop();
            } catch (e) {
                r.stop();
                log.debug("hovering because of Exception");
            }
        }
    }
});
