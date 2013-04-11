var attr = require("attr");

exports = module.exports = {
  title       : attr(),
  entries     : attr(),
  image       : attr(),
  poem        : attr(),
  suggestions : attr(),
  len         : len
};

function len(){
  return exports.entries().length;
}
