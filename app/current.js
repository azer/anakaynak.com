var attr              = require("attr"),
    sortingStorageKey = 'eksi:sort-reverse';

exports = module.exports = {
  title       : attr(),
  entries     : attr(),
  image       : attr(),
  poem        : attr(),
  suggestions : attr(),
  rev         : attr( !! localStorage[sortingStorageKey] ),
  len         : len
};

exports.rev.toggle = function(){
  if( exports.rev( !exports.rev() ) ) {
    localStorage[sortingStorageKey] = true;
  } else {
    delete localStorage[sortingStorageKey];
  }
};

function len(){
  return exports.entries().length;
}
