var DATABASE;
var COLLECTION;
var ITEMS_PER_PAGE;

function getItems(params) {
  var db = DATABASE || params.db;
  return db.collection(COLLECTION || params.collection)
    .find(params.query || {})
    .sort(params.sort || { _id: 1})
    .skip(params.skip || 0)
    .limit(params.items_per_page || ITEMS_PER_PAGE)
    .toArray()
    .then(function(docs) {
      return docs;
    })
    .catch(function(err) {
      return err;
    });
}

function count(params) {
  var db = DATABASE || params.db;
  return db.collection(COLLECTION || params.collection)
    .find(params.query)
    .count()
    .then(function(numItems){
      var items_per_page = params.items_per_page || ITEMS_PER_PAGE
      var numPages = 0;
      if (numItems > items_per_page ) {
        numPages = Math.ceil(numItems/items_per_page);
      }
      return {
        pages: numPages,
        total: numItems
      };
    })
    .catch(function(err){
      return err;
    });
}

function getCategories(params) {
  var db = DATABASE || params.db;
  return db.collection(COLLECTION || params.collection)
        .aggregate([
            { $match: { category: { $exists: true, $ne: null} }},
            { $group: {
              _id: { category: "$category" },
              num: { $sum: 1}
            }},
            { $project: { _id: "$_id.category", num: 1}},
            { $sort: {_id: 1}}
        ])
        .toArray()
        .then(function(docs){
          var allSum = 0;
          docs.forEach(function(cat) {
              allSum += Number(cat.num);
          });
          docs.unshift({ _id: 'All', num: allSum });
          
          return docs;
        })
        .catch(function(err){
          return err;
        });
}

module.exports = function(params) {

  COLLECTION = params.collection;
  DATABASE = params.db;
  ITEMS_PER_PAGE = params.items_per_page || 5;

  return {
    count: count,
    getItems: getItems,
    getCategories: getCategories
  }
}