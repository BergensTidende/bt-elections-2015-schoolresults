'use strict';
var nsd = require('./nsd');
var express = require('express');
var _ = require('lodash');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
	var results = nsd.getResults(req.query.url, function(data) {
		res.send(data);
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
