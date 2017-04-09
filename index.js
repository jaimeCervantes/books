var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var wagner = require('wagner-core');
var port = process.env.PORT || '3000';

require('./api/connection.js')(wagner);

var app = express();
app.set('port', port);
var books = require('./api/items')(wagner);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public/')));

//Routes for api
app.use('/api/books', books);


//Do redirect any path to /public/index.html to make it works as SPA
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, function(){
  console.log('listen on ' + port);
})