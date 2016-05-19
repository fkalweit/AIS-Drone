# AIS-Drone
Game of Drones - HS KL Seminar

## Installation ##
Um alle nötigen Abhänigkeiten zu installieren 'npm install' ausführen.
Node-Version: 4.4.4

## Starten der Anwendung ##
Die Anwendung kann mit 'npm start' oder durch Aufrufen von 'node main.js [OPTION]' gestartet werden.
Per Default wird der Xbox-Controller zum Steuern benutzt und auf der Console werden dem Benutzer die wichtigsten Informationen angezeigt.

![screenshot 2016-05-19-15 33 49](https://cloud.githubusercontent.com/assets/9308836/15395297/6b3dc334-1dd7-11e6-961d-24e6ff83bfad.jpg)

## Code Infos ##
Die Node Anwendung ist Komponentenweise aufgebaut. Um eine Komponente in einer anderen zu benutzen einfach require(./name) (ohne .js) verwenden, dann steht alles im Module-Exports-Block zur Verfügung.

### Beispiel:

keyboard.js:

```javascript
require('./drone');
var d = Drone.getAndActivateDrone();
```

drone.js:

```javascript
module.exports = {
  getAndActivateDrone: function () {
    if(!started){
      d.start();
      started = true;
    }
    return d;
  }
};
```
