var express = require('express');
var router = express.Router();

var crudFn = require('./crud');
var collection = 'books';
var ITEMS_PER_PAGE = 5;

function get(db) {
  router.get('/', function(req, res) {
    var query = {};
    var page = req.query.page ? Number(req.query.page) : 0;
    var numPages = 0;
    var crud = crudFn({ db: db,
          collection: collection,
          items_per_page: ITEMS_PER_PAGE
        });

    var iterable = [ 
                    crud.count({ query: query }),
                    crud.getItems({ query: query, skip: ITEMS_PER_PAGE*page }),
                    crud.getCategories({})
                  ];

    return Promise.all(iterable)
      .then(function(results) {
        results[0].page = page;
        return res.json({
          pagination: results[0],
          items: results[1],
          categories: results[2]
        });
      })
      .catch(function(err){
        return res.json(err);
      });
  });
}



module.exports = function(wagner, params) {
  wagner.invoke(function(conn) {
    return conn;
  })
  .then(function(db){
    get(db);  
  });

  return router;
};