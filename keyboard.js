//==================== INCLUDE ====================

var Cylon = require('cylon');

/* Ermöglicht Zugriff auf den Drohnenroboter.
   Dieser ist der Einfachheit halber immer mit 'r' benannt.
   Drohne ist also d.drone
*/
var Drone = require('./drone');

var Gamepad = require("gamepad");

var BalanceBoard = require('./balanceboard')

var Main = require('./main');

var log = require('./logger').createLogger('Keyboard');

//====================== CODE ======================


Cylon.robot({
    connections: {
        keyboard: {
            adaptor: 'keyboard'
        }
    },

    devices: {
        keyboard: {
            driver: 'keyboard'
        }
    },

    work: function(k) {

        k.keyboard.on('1', function(key) {
            log.debug("toggle gamepad");

            Main.setControllerActivated(!Main.isControllerActivated());
        });

        k.keyboard.on('2', function(key) {
            log.debug("toggle joystick");

            Main.setJoystickActivated(!Main.isJoystickActivated());
        });

        k.keyboard.on('3', function(key) {

            log.debug("toggle balanceboard");

            Main.setBalanceBoardActivated(!Main.isBalanceBoardActivated());

            //log.info("calibrate balanceboard");
            //BalanceBoard.calibrateBoard();
            //Main.setBalanceBoardActivated(!Main.isBalanceBoardActivated());
            //TODO
        });

        k.keyboard.on('4', function(key) {
            Main.startTakeTime(0);
        });
        k.keyboard.on('5', function(key) {
            Main.startTakeTime(1);
        });
        k.keyboard.on('6', function(key) {
            Main.startTakeTime(2);
        });

        k.keyboard.on('7', function(key) {
            Main.stopTakeTime(0);
        });

        k.keyboard.on('8', function(key) {
            Main.saveTime(0);
        });

        k.keyboard.on('r', function(key) {
            if (Main.getRaceStatus() == true) {
                Main.stopRace();
            } else {
                Main.startRace();
            }
        });

        k.keyboard.on('t', function(key) {
            process.stdout.clearLine();
            log.info("TAKEOFF");
            r.takeOff();
            //after((5).seconds(), bebop.drone.land);
        });

        k.keyboard.on('l', function(key) {
            process.stdout.clearLine();
            log.info("LAND!");
            r.land();
        });

        k.keyboard.on('space', function(key) {
            process.stdout.clearLine();
            log.info("EMERGENCY!");
            r.emergency();
        });

        k.keyboard.on('return', function(key) {
            r.stop();
            log.debug("Hover");
            Main.deactivateAll();
        });

        k.keyboard.on('w', function(key) {
            log.debug("FORWARD");
            r.forward(100);
        });

        k.keyboard.on('a', function(key) {
            log.debug("LEFT!");
            r.left(100);
        });

        k.keyboard.on('s', function(key) {
            log.debug("BACKWARD");
            r.backward(100);
        });

        k.keyboard.on('d', function(key) {
            log.debug("RIGHT!");
            r.right(100);
        });

        k.keyboard.on('e', function(key) {
            log.debug("UP");
            r.up(50);
        });

        k.keyboard.on('q', function(key) {
            log.debug("DOWN");
            r.down(50);
        });

        k.keyboard.on('up', function(key) {
            log.debug("UP");
            r.up(50);
        });

        k.keyboard.on('down', function(key) {
            log.debug("DOWN");
            r.down(50);
        });

        k.keyboard.on('left', function(key) {
            log.debug("counterclockwise");
            r.counterClockwise(100);
        });

        k.keyboard.on('right', function(key) {
            log.debug("clockwise");
            r.clockwise(100);
        });

        k.keyboard.on('p', function(key) {
            log.debug("TAKING PICTURE");
            r.takePicture();
        });

        k.keyboard.on('v', function(key) {
            Drone.toggleVideoRecording();
        });

        k.keyboard.on('i', function(key) {
            var fs = require("fs");

            var output = fs.createWriteStream("./video.h264"),
                video = r.getVideoStream();
            video.pipe(output);

        });

        k.keyboard.on('h', function(key) {
            log.debug("SetHome");
            Drone.setCurrentPositionToHome();
        });

        k.keyboard.on('end', function(key) {
            process.stdout.clearLine();
            log.info("quit");
            process.exit(0);
        });

        k.keyboard.on('keyup', function(key) {
            log.debug("STOP -> HOVER");
            r.stop();
        });

    }
}).start();

// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Drohne und anderer Funktionen in anderen Modulen.
module.exports = {
    setDrone: function(value) {
        r = value;
    }
};
