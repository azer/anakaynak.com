var io      = require("./io"),
    revtimer;

exports                     = module.exports = entries;
exports.checkForMoreEntries = checkForNewEntries;
exports.more                = more;
exports.suggestions         = suggestions;

function checkForNewEntries(){
  revtimer = setTimeout(checkForNewEntries, 5000);
}

function entries(title, rev, callback){
  io.pub('user searches for', { title: title, rev: rev });

  io.sub('eksi sozluk results for ' + title, function(results){
    callback(results);
  });

  io.sub('no eksi sozluk results for ' + title, function(suggestions){
    callback(suggestions);
  });
}

function more(title, rev, from, callback){
  var channel = 'more eksi sozluk results for ' + title;

  io.sub(channel, function cb(results){
    io.unsub(channel, cb);
    callback(results);
  });

  io.pub('load more eksi sozluk entries', {
    title: title,
    from: from,
    to: from + 10,
    rev: rev
  });
}

function suggestions(keyword, callback){
  io.pub('user asks suggestions for', { keyword: keyword });
  io.sub('eksi sozluk suggestions for ' + keyword, function(result){
    callback(undefined, result);
  });
}
