//==================== INCLUDE ====================

var Cylon = require('cylon');

/* Ermöglicht Zugriff auf den Drohnenroboter.
   Dieser ist der Einfachheit halber immer mit 'd' benannt.
   Drohne ist also d.drone
*/
var Drone = require('./drone');

//====================== CODE ======================

var d = Drone.getAndActivateDrone();

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
      d.drone.takeOff();
      //after((5).seconds(), bebop.drone.land);
    });

    k.keyboard.on('space', function(key) {
      console.log("EMERGENCY!");
      d.drone.emergency();
    });

    k.keyboard.on('l', function(key) {
      console.log("LAND!");
      d.drone.land();
    });

    k.keyboard.on('e', function(key) {
      console.log("UP");
      d.drone.up(10);
    });

    k.keyboard.on('q', function(key) {
      console.log("DOWN");
      d.drone.down(10);
    });

    k.keyboard.on('w', function(key) {
      console.log("FORWARD");
      bebop.drone.forward(20);
    });

    k.keyboard.on('s', function(key) {
      console.log("BACKWARD");
      d.drone.backward(20);
    });

    k.keyboard.on('a', function(key) {
      console.log("LEFT!");
      d.drone.left(20);
    });

    k.keyboard.on('d', function(key) {
      console.log("RIGHT!");
      d.drone.right(20);
    });

    k.keyboard.on('keyup', function(key){
      console.log("STOP -> HOVER");
      d.drone.stop();
    });
  }
}).start();
