var net = require('net');
var split = require('split');

var Drone = require('./drone');
var r = Drone.getAndActivateDrone();

var server = net.createServer(function(connection) {
  console.log("Client connected");

  connection.setEncoding('utf8');

  var stream = connection.pipe(split(JSON.parse));

  stream.on('data', function(data){
    var massX = data['massX'];
    var massY = data['massY'];

      if(massX > 0.1){
        massX = Math.round(massX * 100)/4;
        console.log("moving right by: " + massX);
        r.right(massX);
      }else if(massX < -0.1){
        massX = Math.round(massX * -100)/4;
        console.log("moving left by: " + massX);
        r.left(massX);
      }else{
        //r.drone.hover();
      }

      if(massY > 0.1){
        massY = Math.round(massY * 100)/4;
        console.log("moving backward by: " + massY);
        r.backward(massY);
      }else if(massY < -0.1){
        massY = Math.round(massY * -100)/4;
        console.log("moving forward by: " + massY);
        r.forward(massY);
      }else{

        //r.drone.stop();
      }
  });

  connection.on('message', function(msg){
    console.log(msg);
  });

  connection.on ('end', function(status){
    console.log('client disconnected');
    r.hover();
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
