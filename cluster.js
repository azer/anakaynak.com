var debug   = require('./lib/debug')('cluster'),
    cluster = require("cluster"),
    forks   = 5;

if (cluster.isMaster) {

  while ( forks --> 0 ) {
    debug('forking (%d)', forks);
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    debug('worker ' + worker.process.pid + ' died');
  });

} else {
  require('./server');
}
