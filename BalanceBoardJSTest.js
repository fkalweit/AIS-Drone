var net = require('net');
var split = require('split');

var Drone = require('./drone');
var r = Drone.getAndActivateDrone();

var calibrated = false;
var axe = -1;
var calibR, calibF, calibB, calibL = 0;

var server = net.createServer(function(connection) {
  console.log("Client connected");
  Drone.setBoardActivated(true);

  connection.setEncoding('utf8');

  var stream = connection.pipe(split(JSON.parse));

  stream.on('data', function(data){
    if(!calibrated){
      calibrate(data);
    }else{
      var massX = data['massX'];
      var massY = data['massY'];

        if(massX > 0.1){
          massX = Math.round(massX * 100) * (100 / calibR);
          console.log("moving right by: " + massX);
          r.right(massX);
        }else if(massX < -0.1){
          massX = Math.round(massX * -100) * (100 / calibL);
          console.log("moving left by: " + massX);
          r.left(massX);
        }else{
          //r.drone.hover();
        }

        if(massY > 0.1){
          massY = Math.round(massY * 100) * (100 / calibB);
          console.log("moving backward by: " + massY);
          r.backward(massY);
        }else if(massY < -0.1){
          massY = Math.round(massY * -100) * (100 / calibF);
          console.log("moving forward by: " + massY);
          r.forward(massY);
        }else{

          //r.drone.stop();
        }
    }
  });

  connection.on('message', function(msg){
    console.log(msg);
  });

  connection.on ('end', function(status){
    Drone.setBoardActivated(false);
    console.log('client disconnected');
  });
});

// grab a random port.
server.listen({host: 'localhost', port: 6112, exclusive: true}, () => {
  address = server.address();
  console.log('opened server on %j', address);
});

server.on('data', function (data) {
    console.log('1');
    console.log(data);
  });

server.on ('message', function(data){
  console.log('2');
  console.log('got message');
});

server.on ('error', function(e){
  console.log('Error caught');
  console.log(e);
});

server.on ('disconnect', function(){
  console.log('disconnect');
});

function calibrate(data){
  startCalibInterval();

  var massX = data['massX'];
  var massY = data['massY'];

    if(massX > 0.1 && axe == 0){
      calibR = Math.max(massX, calibR);
      console.log("R-Max: " + calibR);
    }else if(massX < -0.1 && axe == 1){
      calibL = Math.max(massX, calibL);
      console.log("L-Max: " + calibL);
    }else{
      //r.drone.hover();
    }

    if(massY > 0.1 && axe == 2){
      calibB = Math.max(massY, calibB);
      console.log("B-Max: " + calibB);
    }else if(massY < -0.1 && axe == 3){
      calibF = Math.max(massY, calibF);
      console.log("F-Max: " + calibF);
    }else{
      //r.drone.stop();
    }
}

function startCalibInterval(){
  axe++;
  console.log("Achse: " + axe + " wird kalibriert");
  setInterval(function () {
    if(axe < 4){
      startCalibInterval();
    }else if(axe >= 4){
      calibrated = true;
    }
  }, 5000);
}
