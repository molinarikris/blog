#!/usr/local/bin/nodemon
var app = require('../main');

app.listen(2251, function() {
  console.log('Blog service listening on port 2251.');
});
