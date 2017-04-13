var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../config');

var url = 'mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.host + '/' + config.db.name;

module.exports = function(wagner) {
  var connPromise = MongoClient.connect(url);
   wagner.factory('conn', function(){
    return connPromise.then(function(conn){
      console.log('Se conecto a db books');
      return conn;
    })
    .catch(function(err) {
      console.log(err);
      return err;
    });
  });
}