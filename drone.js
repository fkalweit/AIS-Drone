var Cylon = require('cylon');

var started = false;

var d = Cylon.robot({
  connections: {
    bebop: { adaptor: 'bebop' }
  },

  devices: {
    drone: { driver: 'bebop' }
  },

  /* work: function(my) {
    //my.drone.takeOff();
    //after((5).seconds(), my.drone.land);
  }
  */
});


// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Drohne in anderen Modulen.
module.exports = {
  getAndActivateDrone: function () {
    if(!started){
      d.start();
      started = true;
    }
    return d;
  }
};
