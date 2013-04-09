module.exports = newChannels;

function newChannels(socket){

  var channels = {};

  socket.subscribe(function(newSocket){

    var pub = newPublisher(newSocket);

    newSocket.sub(function(rawMsg){
      var msg = parseRawMsg(rawMsg);

      if( ! msg || ! msg.channel ) return;
      if( ! channels[msg.channel] ) return debug('Unrecognized channel: %s', msg.channel);

      debug('Distributing a new message to channel "%s"', msg.channel);

      channels[msg.channel].publish(msg.content, pub);
    });

  });

}

function newPublisher(socket){
  return function(channel, content){
    socket.pub(JSON.stringify({ channel: channel, content: content }));
  };
}
