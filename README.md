# AIS-Drone
Game of Drones - HS KL Seminar

## Installation ##
1. Klone das git-Repo ``` git clone https://github.com/fog1992/AIS-Drone.git ``` 
   oder lade die Zip-Datei
2. Den Ordner 'AIS-Drone' öffnen ``` cd AIS-Drone ```
3. Installation der benötigten Pakete: ``` npm install ```

Node-Version: 4.4.4

## Starten der Anwendung ##
Die Anwendung kann mit ```npm start``` oder durch Aufrufen von ```node main.js [OPTION]``` gestartet werden.
Per Default wird der die Tastatur zum Steuern benutzt und auf der Console werden dem Benutzer die wichtigsten Informationen angezeigt. Mit den Tasten '1' und '2' können weitere Geräte zum Steuern aktiviert werden. Das Hilfemenü wird mit der Option --help oder -? angezeigt:

![screenshot 2](https://cloud.githubusercontent.com/assets/9308836/16233372/67055744-37ce-11e6-8361-48a1d9a53fc7.jpg)

## Tastenbelegung ##
### Keyboard ###
![keyboard](https://cloud.githubusercontent.com/assets/9308836/16232917/b10345ec-37cc-11e6-8957-83d4ee869502.png)
### Xbox ###
![xbox-default](xbox-default.png)

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
