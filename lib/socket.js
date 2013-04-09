var debug  = require('./debug')('socket'),
    pubsub = require('new-pubsub'),
    app    = require('./app'),
    io     = require('engine.io').attach(app.server),

    socket;

debug('Initialized');

exports = module.exports = pubsub();

io.on('connection', function(socket){
  debug('New connection established');

  exports.publish({
    self: socket,
    close: function(callback){
      socket.on('close', callback);
    },
    pub: function(msg){
      socket.send(msg);
    },
    sub: function(callback){
      socket.on('message', callback);
    }

  });

});
