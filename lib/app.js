var debug = require('./debug')('app'),
    app   = require('./server');

module.exports = app;

app.get('/', function(req, res){
  res.sendfile('templates/index.html');
});

app.get('/:title', function(req, res){
  res.sendfile('templates/index.html');
});
