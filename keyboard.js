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
    keyboard: { adaptor: 'keyboard' }
  },

  devices: {
    keyboard: { driver: 'keyboard' }
  },

  work: function(k) {

    k.keyboard.on('t', function(key) {
      log.info("TAKEOFF");
      r.takeOff();
      //after((5).seconds(), bebop.drone.land);
    });

    k.keyboard.on('space', function(key) {
      log.info("EMERGENCY!");
      r.emergency();
    });

    k.keyboard.on('l', function(key) {
      log.info("LAND!");
      r.land();
    });

    k.keyboard.on('e', function(key) {
      log.info("UP");
      r.up(50);
    });

    k.keyboard.on('q', function(key) {
      log.info("DOWN");
      r.down(50);
    });

    k.keyboard.on('w', function(key) {
      log.info("FORWARD");
      r.forward(100);
    });

    k.keyboard.on('s', function(key) {
      log.info("BACKWARD");
      r.backward(100);
    });

    k.keyboard.on('a', function(key) {
      log.info("LEFT!");
      r.left(100);
    });

    k.keyboard.on('d', function(key) {
      log.info("RIGHT!");
      r.right(100);
    });

    k.keyboard.on('keyup', function(key){
      log.info("STOP -> HOVER");
      r.stop();
    });

    k.keyboard.on('p', function(key){
      log.info("TAKING PICTURE");
      r.takePicture();
    });

    k.keyboard.on('v', function(key){
      Drone.toggleVideoRecording();
    });

    k.keyboard.on('keyup', function(key){
      log.info("STOP -> HOVER");
      r.stop();
    });

	k.keyboard.on('o', function(key) {
      log.info("SetHome");
      Drone.setCurrentPositionToHome();
    });

  k.keyboard.on('1', function(key) {
      log.info("toggle gamepad");

      Main.setControllerActivated(!Main.isControllerActivated());
  });

  k.keyboard.on('2', function(key) {
    log.info("toggle joystick");

    Main.setJoystickActivated(!Main.isJoystickActivated());
  });

  k.keyboard.on('3', function(key) {

    log.info("toggle balanceboard");

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

  k.keyboard.on('0', function(key) {
      if(Main.getRaceStatus() == true){
        Main.stopRace();
      }else {
        Main.startRace();
      }
    });

  k.keyboard.on('left', function(key) {
        log.info("counterclockwise");
        r.counterClockwise(100);
  });
  k.keyboard.on('right', function(key) {
        log.info("clockwise");
        r.clockwise(100);
  });

  k.keyboard.on('return', function(key) {
              r.stop();
              log.debug("Hover");
              Main.deactivateAll();
  });
  k.keyboard.on('end', function(key) {
        log.info("quit");
        process.exit(0);
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
