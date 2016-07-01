var log = require('./logger').createLogger('Board');
var net = require('net');
var split = require('split');
var Drone = require('./drone');
var Main = require('./main')
var r = Drone.getAndActivateDrone();

var calibrated = false;
var axe = -1;
var calibR = 0.0;
var calibF = 0.0;
var calibB = 0.0;
var calibL = 0.0;

var boardActivated = false;
var boardConnected = false;

if(!Drone.isConnected()){
  log.fatal("No Drone-Connection");
}

var server = net.createServer(function(connection) {
  log.info("Balance Board connected");

  connection.setEncoding('utf8');

  var stream = connection.pipe(split(JSON.parse));

  stream.on('data', function(data){
    boardConnected = true;
    Drone.setBoardConnected(true);

    if (boardConnected && Main.isBalanceBoardActivated()) {
      if(!Drone.isConnected()){
        log.fatal("No Drone-Connection");
      }else{
        if(!calibrated){
          calibrate(data);
        }else{
          var massX = data['massX'];
          var massY = data['massY'];

            if(massX > 0.1){
              massX = Math.round(massX * 100) * (100 / calibR);
              log.debug("moving right by: " + massX);
              r.right(massX);
            }else if(massX < -0.1){
              massX = Math.round(massX * -100) * (100 / -calibL);
              log.debug("moving left by: " + massX);
              r.left(massX);
            }

            if(massY > 0.1){
              massY = Math.round(massY * 100) * (100 / calibB);
              log.debug("moving backward by: " + massY);
              r.backward(massY);
            }else if(massY < -0.1){
              massY = Math.round(massY * -100) * (100 / -calibF);
              log.debug("moving forward by: " + massY);
              r.forward(massY);
            }
        }
    }
  }
  });

  connection.on ('end', function(status){
    boardConnected = false;
    //Drone.setBoardConnected(false);
    log.error('Balance Board Disconnected -> Hovering');
    r.stop();
  });
});

server.listen({host: 'localhost', port: 6112, exclusive: true}, () => {
  address = server.address();
  log.info('opened Balance-Board UDP-Server on localhost:6112');
});

function calibrate(data){
  if(axe == -1){
    startCalibInterval();
  }

  var massX = data['massX'] * 100;
  var massY = data['massY'] * 100;

    if(massX > 0.1 && axe == 0){
      calibR = max(massX, calibR);
      log.debug("R-Max: " + calibR);
    }else if(massX < -0.1 && axe == 1){
      calibL = min(massX, calibL);
      log.debug("L-Max: " + calibL);
    }else{
      //r.drone.hover();
    }

    if(massY > 0.1 && axe == 2){
      calibB = max(massY, calibB);
      log.debug("B-Max: " + calibB);
    }else if(massY < -0.1 && axe == 3){
      calibF = min(massY, calibF);
      log.debug("F-Max: " + calibF);
    }else{
      //r.drone.stop();
    }
}

function startCalibInterval(){
  axe++;
  log.info("Achse: " + axe + " wird kalibriert");
  setTimeout(function () {
    if(axe < 3){
      startCalibInterval();
    }else if(axe >= 3){
      calibrated = true;
    }
  }, 5000);
}

function max(a, b){
  if(a > b){
    return a;
  }else{
    return b;
  }
}

function min(a, b){
  if(a > b){
    return b;
  }else{
    return a;
  }
}

module.exports = {

    isConnected: function() {
        return boardConnected;
    },

    calibrateBoard: function() {
        calibrate();
    }

};
