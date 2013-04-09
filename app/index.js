var io = require("./io");

io.sub('new user', function(user){
  console.log('# new user', user);
});

io.sub('login', function(user){
  console.log('# login', user);
});

io.pub('new user', { name: 'azer', passwd: 123 });
io.pub('login', { name: 'azer login', passwd: 123 });
