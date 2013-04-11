var debug  = require('./debug')('eksi'),
    sozluk = require("eksi-sozluk"),
    redis  = require('./redis'),
    on     = require('./io');

on('user searches for', newSearch);
on('load more eksi sozluk entries', moreResults);
on('user asks suggestions for', suggestions);

debug('Initialized');

module.exports = {
  newSearch: newSearch
};

function newSearch(query, reply){
  debug('Getting results for "%s"', query.title);

  proxy({ title: query.title, from:0, to: 10 }, function(error, results){

    if(error){
      debug('Failed at fetching "%s"', query.title);
      reply('eksi sozluk raises an error', { error: error.message });
      return;
    }

    if(!results || results.entries.length == 0) {
      debug('No results for %s', query.title);

      sozluk.suggestions(query.title, function(error, suggestions){
        reply('no eksi sozluk results for ' + query.title,
              error ? undefined : { title: query.title, suggestions: suggestions });
      });

      return;
    }

    results.title = query.title;

    reply('eksi sozluk results for ' + query.title, results);

  });
}

function moreResults(query, reply){
  debug('Loading more entries for %s, starting from %d', query.title, query.from);

  proxy(query, function(error, results){

    if(error){
      debug('Failed at fetching "%s"', query.title);
      reply('eksi sozluk raises an error', { error: error.message });
      return;
    }

    if(!results || !results.entries.length) return;

    results.title = query.title;

    reply('more eksi sozluk results for ' + query.title, results);

  });

}

function proxy(query, callback){
  var key = 'eksi:' + slugify(query.title);

  debug('Checking out %s %d:%d if already exists in DB', query.title, query.from, query.to);

  redis.zrange(key, query.from, query.to, function(error, results){

    if(error){
      debug('FATAL: Redis is failing');
      callback(error);
      return;
    }

    if(results.length){
      results = results.map(JSON.parse);
      callback(undefined, { entries: results, title: query.title });
      return;
    }

    debug('%s %d:%d is not cached yet', key, query.from, query.to);

    sozluk(query, function(error, results){

      if(error) return callback(error);

      if(!results || !results.entries.length) return callback();

      callback(undefined, results);

      process.nextTick(function(){
        save(key, results);
      });

    });

  });

}

function save(key, results){
  debug('Saving entries from %s', results.title);

  var params = [key];

  results.entries.map(function(el){
    params.push(el.ts);
    params.push(JSON.stringify(el));
  });

  redis.zadd(params, function(error, result){
    debug('Added %d new entries to "%s"', result, key);
  });

}

function slugify(title){
  return title.toLowerCase().replace(/\s/g, '-');
}

function suggestions(query, reply){
  debug('Getting suggestions for %s ', query.keyword);

  sozluk.suggestions(query.keyword, function(error, suggestions){
    if(error || !suggestions || suggestions.length == 0) return;
    reply('eksi sozluk suggestions for ' + query.keyword, suggestions);
  });
}
