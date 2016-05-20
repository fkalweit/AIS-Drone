/* Ermöglicht Zugriff auf ddie Drohne.
Dieser ist der Einfachheit halber immer mit 'r' benannt.
Drohne ist also r
*/
var Drone = require('./drone');
var r = Drone.getAndActivateDrone();

var balanceboardconnected = false;
var logxboxcontrolleraxes = false;
var logxboxcontrollerbuttons = false;
//Drone.useGUI(true);
//r.MediaStreaming.videoEnable(1);

//var fs = require("fs");
var gamepad = require("gamepad");
var net = require('net');
var split = require('split');
var mjpgSream = false;

// Initialize the library
gamepad.init();

// List the state of all currently attached devices
for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
  console.log(i, gamepad.deviceAtIndex());
}

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);

//while(!Drone.isConnected()){

//}


if(!Drone.isConnected()){
  console.log("No Drone-Connection");
}else{

}

var server = net.createServer(function(connection) {
  console.log("Client connected");

  connection.setEncoding('utf8');

  var stream = connection.pipe(split(JSON.parse));

  stream.on('data', function(data){
    var massX = data['massX'];
    var massY = data['massY'];

    if(balanceboardconnected){
      if(!Drone.isConnected()){
        console.log("No Drone-Connection");
      }else{
      if(massX > 0.1){
        massX = Math.round(massX * 100);
        console.log("moving right by: " + massX);
        r.right(massX);
      }else if(massX < -0.1){
        massX = Math.round(massX * -100);
        console.log("moving left by: " + massX);
        r.left(massX);
      }else{
        //r.drone.hover();
      }

      if(massY > 0.1){
        massY = Math.round(massY * 100);
        console.log("moving backward by: " + massY);
        r.backward(massY);
      }else if(massY < -0.1){
        massY = Math.round(massY * -100);
        console.log("moving forward by: " + massY);
        r.forward(massY);
      }else{

        //r.drone.stop();
      }
    }
    }
  });

  connection.on ('end', function(status){
    console.log('Balance Board Disconnected!!!');
    r.stop();
  });
});

server.listen({host: 'localhost', port: 6112, exclusive: true}, () => {
  address = server.address();
  console.log('opened server on %j', address);
});


// Listen for move events on all gamepads
gamepad.on("move", function (id, axis, value) {
  if(!Drone.isConnected()){
    console.log("No Drone-Connection");
  }else{
    switch(axis){
      case 0:
        if(value > 0.15){
          value = Math.round(value * 100);

          if(logxboxcontrolleraxes)
          console.log("moving right by: " + value);

          r.right(value);
        }else if(value < -0.15){
          value = Math.round(value * -100);

          if(logxboxcontrolleraxes)
          console.log("moving left by: " + value);

          r.left(value);
        }else{
          //r.drone.hover();
        }
        break;
      case 1:
        if(value > 0.15){
          value = Math.round(value * 100);

          if(logxboxcontrolleraxes)
          console.log("moving backward by: " + value);

          r.backward(value);
        }else if(value < -0.15){
          value = Math.round(value * -100);

          if(logxboxcontrolleraxes)
          console.log("moving forward by: " + value);

          r.forward(value);
        }else{
          //r.drone.stop();
        }
        break;
      case 2:
        value = Math.round((value * 50) + 50);

        if(logxboxcontrolleraxes)
        console.log("lifting up by: " + value);

        r.up(value);
        break;
      case 5:
        value = Math.round((value * 50) + 50);

        if(logxboxcontrolleraxes)
        console.log("sinking down by: " + value);

        r.down(value);
        break;
      default: {}
    }
  }

    /*console.log("move", {
  id: id,
  axis: axis,
  value: value,
});*/

});

// Listen for button up events on all gamepads
gamepad.on("down", function (id, num) {
  if(!Drone.isConnected()){
    console.log("No Drone-Connection");
  }else{
    try{
      switch(num) {
        case 0:
          if(logxboxcontrollerbuttons)
            console.log("takeoff!");
          r.takeOff();
          break;
        case 1:
          if(logxboxcontrollerbuttons)
            console.log("reset Home to current Position");
          Drone.setCurrentPositionToHome();
          break;
        case 2:
          if(logxboxcontrollerbuttons)
            console.log("hovering...");
          r.stop();
          break;
        case 3:
          if(logxboxcontrollerbuttons)
            console.log("landing...");
          r.land();
          break;
        case 4:
          if(logxboxcontrollerbuttons)
            console.log("counterclockwise -> 30");
          r.counterClockwise(30);
          break;
        case 5:
          if(logxboxcontrollerbuttons)
            console.log("clockwise -> 30");
          r.clockwise(30);
          break;
        case 6:
          if(logxboxcontrollerbuttons)
            console.log("returning Home...home...sweet home");
          r.Piloting.navigateHome(1);
          break;
        case 7:
          if(logxboxcontrollerbuttons)
            console.log("aborted flying home...");
          r.Piloting.navigateHome(0);
          break;
        case 8:
          if(logxboxcontrollerbuttons)
            console.log("EMERGENCY!");
          r.emergency();
          break;
        case 9:
          balanceboardconnected = true;
          if(logxboxcontrollerbuttons)
            console.log("Balance Board Aktiviert");
            break;
        case 10:
          if(logxboxcontrollerbuttons)
            console.log("Balance Board Deaktiviert");
          balanceboardconnected = false;
          r.stop();
          if(logxboxcontrollerbuttons)
            console.log("Hovering...");
          break;
        default:
        r.land();
      }
    }catch (e){
      r.land();
    }
  }

  console.log("up", {
    id: id,
    num: num,
  });
});

  gamepad.on("up", function (id, num) {
    if(!Drone.isConnected()){
      console.log("No Drone-Connection");
    }else{
      try{
        switch(num) {
          case 4:
            if(logxboxcontrollerbuttons)
              console.log("counterclockwise -> 0");
            r.counterClockwise(0);
            break;
          case 5:
            if(logxboxcontrollerbuttons)
              console.log("clockwise -> 0");
            r.clockwise(0);
            break;
          default:
          //r.land();
        }
      }catch (e){
        r.land();
      }
    }
  });


setTimeout(function(){
if (mjpgSream) {


  console.log(mjpgSream);
  var cv = require("opencv");

  var mjpg = r.getMjpegStream(),
      buf = null,
      w = new cv.NamedWindow("Video", 0);

  mjpg.on("data", function(data) {
    buf = data;
  });

  setInterval(function() {
    if (buf == null) {
      return;
    }

    try {
      cv.readImage(buf, function(err, im) {
        if (err) {
          console.log(err);
        } else {
          if (im.width() < 1 || im.height() < 1) {
            console.log("no width or height");
            return;
          }
          w.show(im);
          w.blockingWaitKey(0, 50);
        }
      });
    } catch(e) {
      console.log(e);
    }
  }, 80);
}
}, 1000);
// Listen for button down events on all gamepads
gamepad.on("down", function (id, num) {
  console.log("down", {
    id: id,
    num: num,
  });
});


module.exports = {
log_level: function(value){
  logxboxcontrolleraxes = value;
  logxboxcontrollerbuttons = value;
},
start_stream: function(value){
    console.log("start stream");
    mjpgSream = value;
  }
};
