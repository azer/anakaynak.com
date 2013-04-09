var debug  = require("debug"),
    prefix = 'cats';

module.exports = function(name){
  return debug(prefix + ':' + name);
};
