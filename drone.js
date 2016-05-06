var Bebop = require('node-bebop');

var drone = Bebop.createClient();
var connected = false;

drone.connect(function() {
  connected = true;
  console.log("Drone connected!");
})

// Export-Methoden des Moduls.
// Ermöglicht Aufruf der Drohne in anderen Modulen.
module.exports = {
  getAndActivateDrone: function () {
    return drone;
  },

  isConnected: function (){
    return connected;
  }
};
