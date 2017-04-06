var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../config');

var url = 'mongodb://' + config.db.user + ':' + config.db.password + '@ds149030.mlab.com:49030/books';

module.exports = function(wagner) {
  var connPromise = MongoClient.connect(url);
   wagner.factory('conn', function(){
    return connPromise.then(function(conn){
      console.log('Se conecto a db books');
      return conn;
    });
  });
}