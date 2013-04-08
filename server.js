var debug   = require('debug')('server:'),
    express = require("express"),
    app     = express(app),
    server  = require('http').createServer(app),
    io      = require('engine.io').attach(server),
    port    = process.env.port || 3000;

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('templates/index.html');
});

io.on('connection', function(socket){
  socket.on('message', function(v){
    socket.send('pong');
  });
});

server.listen(port);
debug('Listening port on %s', port);
