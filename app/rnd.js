module.exports = rnd;

function rnd(list){
  return function(){
    return list[ Math.floor(Math.random() * list.length) ];
  };
}
