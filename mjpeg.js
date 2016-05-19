console.log("STREAM");
var Drone = require('./drone');
var r = Drone.getAndActivateDrone();
var cv = require("opencv");

var mjpg = r.getMjpegStream(),
    buf = null,
    w = new cv.NamedWindow("Video", 0);

  console.log("MJpegStream");

  r.connect(function() {
    console.log("start MediaStreaming");
    drone.MediaStreaming.videoEnable(1);
  });

  mjpg.on("data", function(data) {
    buf = data;
  });

  setInterval(function() {
    if (buf == null) {
      return;
    }

    try {
      console.log("cv read Buffer");
      cv.read(buf, function(err, im) {
        if (err) {
          console.log(err);
        } else {
          if (im.width() < 1 || im.height() < 1) {
            return;
          }
          w.show(im);
          w.blockingWaitKey(0, 50);
        }
      });
    } catch(e) {
      console.log(e);
    }
  }, 10);
