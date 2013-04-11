var current = require("./current"),
    images  = require('./images'),
    poems   = require('./poems'),
    rnd     = require('./rnd'),
    defer   = require('./defer'),

    image   = rnd(images),
    poem    = rnd(poems);

current.entries.subscribe(defer(10, function(){
  current.image(image());
}));

current.poem(poem());

module.exports = {
  image: image,
  poem: poem
};
