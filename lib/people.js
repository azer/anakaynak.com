var debug = require('./debug')('people'),
    mongo = require('./mongo'),
    on    = require("./io");

var userSchema = mongo.Schema({
  email    : String,
  password : String,
  name     : String
});

var User = mongo.model('User', userSchema);

on('new user', function(user, reply){
  console.log('new user', user);
  reply('new user', 'created ' + user.name);
  //socket.pub('user created: ', user.name);
});

on('login', function(user, reply){
  console.log('login', user);
  reply('login', 'user logged in: '+ user.name);
});
