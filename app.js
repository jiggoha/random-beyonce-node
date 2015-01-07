var express = require('express'),
		bodyParser = require('body-parser'),
		connect = require('connect'),
		methodOverride = require('method-override'), // for PUT request with html form
		expressLayouts = require('express-ejs-layouts'),
		MongoClient = require('mongodb').MongoClient,
		routes = require('./routes')

var app = express();

MongoClient.connect('mongodb://localhost:27017/random-beyonce', function(err, db) {
	"use strict";
	if(err) throw err;

	app.use(bodyParser.json()); // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	  extended: true
	}));

	app.use(methodOverride(function(req, res){
	  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
	    // look in urlencoded POST bodies and delete it
	    var method = req.body._method
	    delete req.body._method
	    return method
	  }
	}));

	app.set('view engine', 'ejs');
	app.set('layout', 'layout'); // not sure what the second 'layout' means, but it works...
	app.use(expressLayouts);

	routes(app, db);

	app.listen(3000, function() {
		console.log('Listening on port 3000');
})})