var express = require('express');
var app = require('./app');
var port = 3000

var server = app.listen(port, function(){
    console.log('Multicore_marker RESTful API server started on: ' + port);
});
