console.log("STREAM");

"use strict";

var cv = require("opencv");
var Drone = require('./drone');
var r = Drone.getAndActivateDrone();

var mjpg = Drone.getMjpegStream(),
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
}, 100);
