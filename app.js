var express = require('express'),
		bodyParser = require('body-parser');

var app = express();

app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.set('view engine', 'ejs');

app.listen(3000, function() {
	console.log('Listening on port 3000')
})

var sets = new Object();

app.get('/', function(req, res) {
	res.send('This is the root page.');
})

app.route('/sets')
.get(function(req, res) {
	set_names = Object.keys(sets)

	res.render('sets', {sets: sets, set_names: set_names});
})
.post(function(req, res) {
	set_name = req.body.set_name
	link_list = req.body.link_list.split(", ")
	sets[set_name] = link_list;
	res.redirect('/sets');
})

app.get('/sets/new', function(req, res) {
	res.render('new');
})

app.get('/sets/:name', function(req, res) {
	set_name = req.params.name;

	link_list = sets[set_name]
	if (link_list) {
		res.render('show', {set_name: set_name, link_list: link_list})
	} else {
		res.send("No set found.")
	}
})