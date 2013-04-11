var dateFormat = require('dateformat'),
    current    = require("./current"),
    eksi       = require('./eksi'),
    defer      = require('./defer'),

    isLoading  = false,

    urlRe      = /(^|[^\w])(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
    bkzRe      = /\(bkz\:\s?([^\(\)]+)\s?\)/g;

$('.search').focus();

$(window).scroll(onScroll);

current.image.subscribe(onImageChange);
current.poem.subscribe(onPoemChange);

current.suggestions.subscribe(function(update){

  if(update == undefined){
    $('.suggestions').hide();
    $('.content').show();
    return;
  }

  $('.suggestions .title').html(update.title);
  $('.suggestions ul').html(
    update.suggestions.map(function(el){
      return '<li><a href="/' + el + '">' + el + '</a></li>';
    })
    .join('\n')
  );

  $('.suggestions').show();
  $('.content').hide();
});

current.title.subscribe(function(title){
  loading();

  window.scrollTo(0, 0);

  document.title = title + ' | Ana Kaynak';

  $('.title span').html(title);
  $('.eksi').html('');

});

current.entries.subscribe(function(entries){
  $('.eksi').append(entries.map(entryView).join('\n'));
  $('.suggestions').hide();
  notLoading();
  fill();
});

function entryView(entry){
  return '<li class="entry">'
    + prettifyEntryContent(entry.content)

    + '<div class="about">'

    + '<div class="author"><a href="/'
    + entry.author
    + '">'
    + entry.author
    + '</a></div>'

    + '<div class="separator">―</div>'

    + '<div class="date">'
    + dateFormat(entry.ts, 'fullDate')
    + '</div>'

    + '</div>'
    + '</li>';
}

function fill(){
  if( $('.content').height() - 50 < $(window).height() ){
    more();
  }
}

function loadImage(url, callback){
  $('<img/>').attr('src', url).load(callback);
}


function loading(){
  $('.content').hide();
  $('.loading').show();
  isLoading = true;
}

function more(){
  if(isLoading){
    return;
  }

  isLoading = true;

  eksi.more(current.title(), current.len(), function(results){
    if(results.title != current.title()) return;

    isLoading = false;

    Array.prototype.push.apply(current.entries(), results.entries);
    current.entries.publish(results.entries);
  });
}

function notLoading(){
  $('.content').show();
  $('.loading').hide();

  isLoading = false;
}

function onImageChange(image){
  var next     = $('.next'),
      el       = $('.photo'),
      url      = typeof image == 'string' ? image : image[0],
      position = url == image ? 'center' : image[1];

  loadImage(url, function() {
    next.css({ 'background-image': 'url(' + url + ')', 'background-position': position });

    next.fadeIn(1500, function(){
      el.css({ 'background-image': 'url(' + url + ')', 'background-position': position });
      next.hide();
    });

  });
}

function onPoemChange(poem){
  $('.poem').attr('href', poem.url).html(poem.text);
}


function onScroll(){

  var viewport     = $(window).height(),
      scrollTop    = $(document).scrollTop(),
      scrollHeight = document.body.scrollHeight;

  if( viewport + scrollTop + 400 >= scrollHeight && !isLoading ){
    more();
  }
}

function prettifyEntryContent(content){
  return content
    .replace(/\n/g, '<br>')
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
    .replace(urlRe, "$1<a href='$2'>$2</a>");
}
