//==================== INCLUDE ====================

var Cylon = require('cylon');

/* Ermöglicht Zugriff auf den Drohnenroboter.
   Dieser ist der Einfachheit halber immer mit 'r' benannt.
   Drohne ist also d.drone
*/
var Drone = require('./drone');

var Gamepad = require("gamepad");

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
      r.up(10);
    });

    k.keyboard.on('q', function(key) {
      log.info("DOWN");
      r.down(10);
    });

    k.keyboard.on('w', function(key) {
      log.info("FORWARD");
      r.forward(20);
    });

    k.keyboard.on('s', function(key) {
      log.info("BACKWARD");
      r.backward(20);
    });

    k.keyboard.on('a', function(key) {
      log.info("LEFT!");
      r.left(20);
    });

    k.keyboard.on('d', function(key) {
      log.info("RIGHT!");
      r.right(20);
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
        Main.controllerActivated = !Main.controllerActivated;
        //TODO
    });

    k.keyboard.on('0', function(key) {
          //TODO
      });
  k.keyboard.on('left', function(key) {
              console.log("counterclockwise");
                r.counterClockwise(30);
  });
  k.keyboard.on('right', function(key) {
              console.log("clockwise");
              r.Clockwise(30);
  });
  k.keyboard.on('end', function(key) {
              console.log("quit");
              process.exit(0);
  });




	// k.keyboard.on('p', function(key) {
  //     log.info("DISCONNECT");
  //     r.Network.disconnect()
  //   });

  }
}).start();

// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Drohne und anderer Funktionen in anderen Modulen.
module.exports = {
  setDrone: function(value) {
    r = value;
  }
};
