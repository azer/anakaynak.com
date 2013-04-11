var debug  = require("debug"),
    prefix = 'anakaynak';

module.exports = function(name){
  return debug(prefix + ':' + name);
};
