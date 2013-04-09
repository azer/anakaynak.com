var debug = require('./debug')('app'),
    app   = require('./server');

module.exports = app;

app.get('/', function(req, res){
  res.sendfile('templates/index.html');
});

/*var debug   = require('./debug')('app'),
    express = require("express"),
    app     = express(app),
    server  = require('http').createServer(app);

app.use('/static', express.static(__dirname + '/public'));

module.exports = {
  app    : app,
  server : server
};*/
