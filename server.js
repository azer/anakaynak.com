var debug  = require('./lib/debug')('main'),
    app    = require('./lib/app'),
    people = require('./lib/people'),
    port   = process.env.port || 3000;

/*socket(function(conn){
  var i = 0;

  conn.sub(function(msg){
    console.log('<-', msg);
    conn.pub('pong');
  });

  conn.close(function(){
    console.log('close');
  });

});*/

app.server.listen(port);

debug('Listening port on %s', port);
