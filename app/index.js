var eio = require('engine.io-client');

var socket = new eio();

socket.onopen = function(){
  socket.onmessage = function(data){};
  socket.onclose = function(){};
};
