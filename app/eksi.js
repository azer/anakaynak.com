var io = require("./io");

exports = module.exports = entries;
exports.more = more;
exports.suggestions = suggestions;

function entries(title, callback){
  io.sub('eksi sozluk results for ' + title, function(results){
    callback(results);
  });

  io.sub('no eksi sozluk results for ' + title, function(suggestions){
    callback(suggestions);
  });
}

function more(title, from, callback){
  var channel = 'more eksi sozluk results for ' + title;

  io.sub(channel, function cb(results){
    io.unsub(channel, cb);
    callback(results);
  });

  io.pub('load more eksi sozluk entries', { title: title, from: from, to: from + 10 });
}

function suggestions(keyword, callback){
  io.pub('user asks suggestions for', { keyword: keyword });
  io.sub('eksi sozluk suggestions for ' + keyword, function(result){
    callback(undefined, result);
  });
}
