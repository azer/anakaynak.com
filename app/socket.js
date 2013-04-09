var eio      = require('engine.io-client'),
    socket   = new eio,
    deferred = { callbacks: [], onClose: [], messages: [] },
    isOpen;

socket.onopen = onOpen;

module.exports = {
  close : close,
  pub   : pub,
  sub   : sub
};

function close(cb){
  if(!isOpen) return deferred.onClose.push(cb);

  socket.on('close', cb);
}


function onOpen(){
  isOpen = true;

  deferred.callbacks.forEach(function(cb){
    socket.on('message', cb);
  });

  deferred.messages.forEach(function(msg){
    socket.send(msg);
  });

  deferred.onClose.forEach(function(cb){
    socket.on('close', cb);
  });

  delete deferred;
}

function pub(msg){
  if(!isOpen) return deferred.messages.push(msg);

  socket.send(msg);
}

function sub(cb){
  if(!isOpen) return deferred.callbacks.push(cb);

  socket.on('message', cb);
}
