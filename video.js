var bebop = require('node-bebop'),
    fs = require("fs");

var output = fs.createWriteStream("./video.h264"),
    drone = bebop.createClient(),
    video = drone.getVideoStream();

video.pipe(output);

drone.connect(function() {
  drone.MediaStreaming.videoEnable(1);
});


var http = require('http'),
    fs = require('fs'),
    util = require('util');

var ffmpeg = require('fluent-ffmpeg');


const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(1337);
socket.send()
// server listening 0.0.0.0:41234

/*http.createServer(function (req, res) {

  var fs = require('fs');
var stat = fs.statSync('test.h264');
res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size
});

  //define file path,time to seek the beegining and set ffmpeg binary
  var pathToMovie = 'test.h264';
  var seektime = 100;


  //encoding the video source
  try {
    ffmpeg({source: 'test.h264'})
        //.seekInput(seektime)
        //.withVideoBitrate(1024)
        .withVideoCodec('libx264')
        //.withAspect('16:9')
        //.withFps(24)
        .format('h264')
        .outputOption('-movflags frag_keyframe+faststart')
        .pipe(res);
  } catch (e) {
    console.log(e);
  } finally {

  }


}).listen(1337, '192.168.0.105');
console.log('Server running at http://127.0.0.1:1337/');
*/
