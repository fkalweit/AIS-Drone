# AIS-Drone
Game of Drones - HS KL Seminar

## Code Infos ##
Die Node Anwendung ist Komponentenweise aufgebaut. Um eine Komponente in einer anderen zu benutzen einfach require(./<name>) (ohne .js) verwenden, dann steht alles im Module-Exports-Block zur Verfügung.

Beispiel:

keyboard.js
`
require('./drone');
var d = Drone.getAndActivateDrone();
`

drone.js

`
module.exports = {
  getAndActivateDrone: function () {
    d.start()
    return d;
  }
};
`
