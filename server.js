var debug  = require('./lib/debug')('main'),
    app    = require('./lib/app'),
    eksi   = require('./lib/eksi'),
    port   = process.env.PORT || 3000;

app.server.listen(port);

debug('Listening port on %s', port);
