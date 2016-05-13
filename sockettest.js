var net = require('net');

var server = net.createServer(function(connection) {
  console.log("Client connected");

  connection.on('data', function(data){
    console.log(data);
  });

  connection.on('message', function(msg){
    console.log(msg);
  });

  connection.on ('end', function(status){
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
