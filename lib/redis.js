var debug = require('./debug')('redis'),
    redis = require("redis");

var client = module.exports = redis.createClient();

debug('Initialized');

client.on("error", function (err) {
  debug('Error: ', err);
});
