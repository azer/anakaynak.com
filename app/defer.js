module.exports = defer;

function defer(seconds, fn){
  var timer;

  return function self(){

    if(timer) clearTimeout(timer);

    var args = arguments;

    timer = setTimeout(function(){
      timer = undefined;

      fn.apply(undefined, args);

    }, seconds * 1000);

  };
}
