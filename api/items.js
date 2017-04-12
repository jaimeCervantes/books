var express = require('express');
var router = express.Router();

var crudFn = require('./crud');
var collection = 'books';
var ITEMS_PER_PAGE = 6;
var crud;
var allCategories = 'Todas';

module.exports = function(wagner, params) {
  wagner.invoke(function(conn) {
    return conn;
  })
  .then(function(db){
    crud = crudFn({ db: db,
      collection: collection,
      items_per_page: ITEMS_PER_PAGE
    });

    get(db);
    search(db);
  });

  return router;
};

function get(db) {
  router.get('/category/(:category)?', function(req, res) {
    var query = {};

    if(req.params.category && req.params.category !== allCategories) {
      query.category = req.params.category
    }

    var page = req.query.page ? Number(req.query.page) : 0;
    var numPages = 0;
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


function search(db) {
  router.get('/search/', function(req, res) {
    var query = {};
    var page = req.query.page ? Number(req.query.page) : 0;
    var numPages = 0;

    if(req.query.text) {
      query.$text = { $search: req.query.text };
    }

    if(req.query.category && req.query.category !== allCategories) {
      query.category = req.query.category;
    }

    var iterable = [ 
                    crud.count({ query: query }),
                    crud.searchItems({ query: query, skip: ITEMS_PER_PAGE*page })
                  ];

    return Promise.all(iterable)
      .then(function(results) {
        results[0].page = page;
        return res.json({
          pagination: results[0],
          items: results[1]
        });
      })
      .catch(function(err){
        return res.json(err);
      });
  });
}