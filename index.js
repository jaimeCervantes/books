var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var wagner = require('wagner-core');
require('./api/connection.js')(wagner);

var app = express();
var books = require('./api/items')(wagner);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public/')));

//Routes for api
app.use('/api/books', books);


//Do redirect any path to /public/index.html to make it works as SPA
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(3000, function(){
  console.log('listen on 3000');
})