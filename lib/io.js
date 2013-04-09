var debug  = require("./debug")('io'),
    pubsub = require("new-pubsub"),
    socket = require('./socket'),
    channels  = {};

socket.subscribe(function(socket){

  var pub = newPublisher(socket);

  socket.sub(function(rawMsg){
    var msg = parseRawMsg(rawMsg);

    if( ! msg || ! msg.channel ) return;
    if( ! channels[msg.channel] ) return debug('Unrecognized channel: %s', msg.channel);

    debug('Distributing a new message to channel "%s"', msg.channel);

    channels[msg.channel].publish(msg.content, pub);
  });

});

exports = module.exports = sub;
exports.on = sub;

function newPublisher(socket){
  return function(channel, content){
    socket.pub(JSON.stringify({ channel: channel, content: content }));
  };
}

function parseRawMsg(msg){
  try {
    return JSON.parse(msg);
  } catch (err) {
    debug('Failed to parse "%s"', msg.slice(0, 32));
  }
}


function sub(channel, callback){
  channels[ channel ] || ( channels[ channel ] = pubsub(), debug('Defined %s', channel) );
  channels[ channel ] (callback);
}
