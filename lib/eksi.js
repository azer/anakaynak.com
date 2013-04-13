var debug  = require('./debug')('eksi'),
    sozluk = require("eksi-sozluk"),
    redis  = require('./redis'),
    on     = require('./io'),

    nil    = undefined;

on('user searches for', newSearch);
on('user asks suggestions for', suggestions);
on('check new eksi sozluk entries', checkNewEntries);
on('load more eksi sozluk entries', moreResults);

debug('Initialized');

module.exports = {
  newSearch: newSearch
};

function checkNewEntries(){

}

function newSearch(query, reply){
  debug('Getting results for "%s"', query.title);

  query.from == nil && ( query.from = 0 );
  query.to   == nil && ( query.to = 10 );

  proxy(query, function(error, results){

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
  debug('Loading more entries for %s, starting from %d (rev? %s)', query.title, query.from, query.rev);

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

  queryRedis( query, function(error, results) {

    if(error) return callback(error);

    if(results) return callback(undefined, results);

    ( query.rev ? sozluk.newEntries : sozluk )
    ( query, function(error, results){

      if(error) return callback(error);

      if(!results || !results.entries.length) return callback();

      results.rev = query.rev;

      debug('Found %d entries for %s in Eksi Sozluk.', results.entries.length, query.title);

      callback(undefined, results);

      process.nextTick(function(){
        save(query, results);
      });

    });

  });

}

function queryRedis(query, callback){

  var key = slugify(query.title);

  debug('Checking out %s %d:%d if already exists in DB. Rev? %s', query.title, query.from, query.to - 1, query.rev);

  var from    = query.from == 0 ? query.from : query.from - 1,
      to      = query.from == 0 ? query.to : query.to - 1;

  redis[ query.rev ? 'zrevrange' : 'zrange' ]( key, from, to, function(error, results){

    if(error){
      debug('Redis is failing');
      callback(error);
      return;
    }

    debug('Found %d Redis records for %s/%d:%d (Rev? %s)', results.length, query.title, query.from, query.to, query.rev);

    if(results.length){
      results = results.map(JSON.parse);
      callback(undefined, { entries: results, title: query.title, rev: query.rev });
      return;
    }

    callback();

  });

}

function save(query, results){
  var key = slugify(query.title);

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
  return 'eksi:' + title.toLowerCase().replace(/\s/g, '-');
}

function suggestions(query, reply){
  debug('Getting suggestions for %s ', query.keyword);

  sozluk.suggestions(query.keyword, function(error, suggestions){
    if(error || !suggestions || suggestions.length == 0) return;
    reply('eksi sozluk suggestions for ' + query.keyword, suggestions);
  });
}
