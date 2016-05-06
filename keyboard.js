//==================== INCLUDE ====================

var Cylon = require('cylon');

/* Ermöglicht Zugriff auf den Drohnenroboter.
   Dieser ist der Einfachheit halber immer mit 'r' benannt.
   Drohne ist also d.drone
*/
var Drone = require('./drone');

//====================== CODE ======================

var r = Drone.getAndActivateDrone();

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
  }
}).start();
