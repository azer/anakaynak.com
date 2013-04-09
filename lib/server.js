var debug         = require('./debug')('server'),
    express       = require("express"),

    expressServer = express(expressServer),
    httpServer    = require('http').createServer(expressServer),

    app           = expressServer;

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use('/static', express.static(__dirname + '/../public'));

exports = module.exports = app;
exports.server = httpServer;
