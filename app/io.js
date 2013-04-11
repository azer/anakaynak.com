var socket   = require('./socket'),
    pubsub   = require('new-pubsub'),
    channels = {};

module.exports = {
  sub   : sub,
  pub   : pub,
  unsub : unsub
};

socket.sub(function(rawMsg){
  var msg = parseRawMsg(rawMsg);

  if( ! msg || ! msg.channel || ! channels[msg.channel] ) return;

  channels[msg.channel].publish(msg.content, pub);
});

function parseRawMsg(msg){
  try {
    return JSON.parse(msg);
  } catch (err) {}
}

function sub(channel, callback){
  channels[ channel ] || ( channels[ channel ] = pubsub() );
  channels[ channel ] (callback);
}

function pub(channel, content){
  socket.pub(JSON.stringify({ channel: channel, content: content }));
}

function unsub(channel, fn){
  channels[channel] && channels[channel].unsubscribe(fn);
}
