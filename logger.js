var Bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');

var prettyLogFile = new PrettyStream();

var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

var fs = require('fs');
var logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});

prettyLogFile.pipe(logStream);
//prettyLogFile.pipe(fs);


// trace = 10, debug = 20, info = 30, warn = 40, error = 50, fatal = 60
var logLevel = 20;
var log = buildLogger('Logger', logLevel);

function buildLogger(filename, lvl){
  return Bunyan.createLogger({name: filename, level: lvl, streams: [{
                level: 'trace',
                type: 'raw',
                stream: prettyLogFile
            },
            {
              level: lvl,
              stream: prettyStdOut
            }
          ]});
}


module.exports = {
  createLogger: function(filename, p_loglevel){
    if(typeof p_loglevel !== 'undefined' && typeof filename !== 'undefined'){
      logLevel = p_loglevel;
      var tmp_logger = buildLogger(filename, p_loglevel);
      log.info("Started Logger for '"+ filename + "' with loglevel: " + p_loglevel);
      return tmp_logger;
    }else if (typeof p_loglevel === 'undefined' && typeof filename !== 'undefined'){
      var tmp_logger = buildLogger(filename, logLevel);
      log.info("Started Logger for '"+ filename + "' with loglevel: " + logLevel);
      return tmp_logger;
    }
  }
}
