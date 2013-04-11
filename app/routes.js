var page   = require("page"),
    search = require('./search');

page('/', home);
page('/:title', search.route);
page('*', notfound);
page();

function home(){
  search(require('./home-topics').random());
}

function notfound(){
  $('.title').html('404');
  $('.content').html('Aradiginiz sayfa bulunamadi.');
}
