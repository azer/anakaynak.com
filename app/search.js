var page    = require('page'),
    io      = require('./io'),
    eksi    = require('./eksi'),
    current = require('./current'),
    defer   = require('./defer'),
    input   = $('.search');

module.exports = search;
module.exports.route = route;

current.rev.subscribe(function(rev){
  search(current.title());
});

input.keypress(defer(0.25, function(e) {

  if(e.which != 13) return;

  page('/' + input.val());

}));

input.keydown(function(e){
  if(e.which == 9) return;
  current.suggestions(undefined);
});

input.keypress(defer(1, function(){
  var title = input.val();

  eksi.suggestions(title, function(error, results){
    current.suggestions({ title: title, suggestions: results });
  });
}));

function route(context){
  input.val('');
  search(context.params.title);
}

function search(title){
  current.title(title);

  eksi(title, current.rev(), function(results){
    if( results.title != current.title() ) return;

    if(results.suggestions){
      current.suggestions(results);
      return;
    }

    current.entries(results.entries);
  });
}
