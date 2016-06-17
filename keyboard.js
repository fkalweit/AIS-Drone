//==================== INCLUDE ====================

var Cylon = require('cylon');

/* Ermöglicht Zugriff auf den Drohnenroboter.
   Dieser ist der Einfachheit halber immer mit 'r' benannt.
   Drohne ist also d.drone
*/
var Drone = require('./drone');

var Gamepad = require("gamepad");


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
      console.log("TAKEOFF");
      r.takeOff();
      //after((5).seconds(), bebop.drone.land);
    });

    k.keyboard.on('space', function(key) {
      console.log("EMERGENCY!");
      r.emergency();
    });

    k.keyboard.on('l', function(key) {
      console.log("LAND!");
      r.land();
    });

    k.keyboard.on('e', function(key) {
      console.log("UP");
      r.up(10);
    });

    k.keyboard.on('q', function(key) {
      console.log("DOWN");
      r.down(10);
    });

    k.keyboard.on('w', function(key) {
      console.log("FORWARD");
      r.forward(20);
    });

    k.keyboard.on('s', function(key) {
      console.log("BACKWARD");
      r.backward(20);
    });

    k.keyboard.on('a', function(key) {
      console.log("LEFT!");
      r.left(20);
    });

    k.keyboard.on('d', function(key) {
      console.log("RIGHT!");
      r.right(20);
    });

    k.keyboard.on('keyup', function(key){
      console.log("STOP -> HOVER");
      r.stop();
    });

	k.keyboard.on('o', function(key) {
      console.log("SetHome");
      Drone.setCurrentPositionToHome();
    });

  k.keyboard.on('1', function(key) {
        console.log("gamepad");
        Gamepad.shutdown();
        //TODO
    });

  k.keyboard.on('2', function(key) {
          console.log("balance board");
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
  //     console.log("DISCONNECT");
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
