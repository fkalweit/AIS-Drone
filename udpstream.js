var udp = require('datagram-stream');


/*var stream = udp({
    address     : '0.0.0.0'         //address to bind to
    , broadcast : '255.255.255.255' //broadcast ip address to send to
    , port      : 5555              //udp port to send to
    , bindingPort : 5556            //udp port to listen on. Default: port
    , reuseAddr : true              //boolean: allow multiple processes to bind to the
                                    //         same address and port. Default: true
 });



var fs = require("fs");
var output = fs.createWriteStream("./video.h264");
*/

var bebop = require('node-bebop');
var createStream = require('broadcast-stream')

var stream = createStream(8999)

var buf = new Buffer("hallo");

stream.on('data', function (msg) {
  console.log(msg.toString())
  console.log(msg.address, msg.port, msg.echo)
})

drone = bebop.createClient(),
video = drone.getVideoStream();

    drone.connect(function() {
      drone.MediaStreaming.videoEnable(1);
      console.log("gogo vid");
    });


  //stream.write(new Buffer(new Date().toString(), 'utf8'))
  video.pipe(stream);

  //stream.write(buf);

const spawn = require("child_process").spawn;

const vlc = spawn('vlc', ['udp://@:8999']);
