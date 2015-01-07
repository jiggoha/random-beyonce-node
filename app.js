var express = require('express'),
		bodyParser = require('body-parser'),
		connect = require('connect'),
		methodOverride = require('method-override'); // for PUT request with html form

var app = express();

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

app.listen(3000, function() {
	console.log('Listening on port 3000')
})

var sets = new Object();

app.get('/', function(req, res) {
	res.send('This is the root page.');
})

app.route('/sets')
.get(function(req, res) {
	set_names = Object.keys(sets);

	res.render('sets', {sets: sets, set_names: set_names});
})
.post(function(req, res) {
	console.log("got to post");
	set_name = req.body.set_name;
	link_list = req.body.link_list.split(", ");
	sets[set_name] = link_list;
	res.redirect('/sets');
})
.put(function(req, res) {
	console.log("got to put");
	console.log(req.body);
	new_set_name = req.body.new_set_name;
	old_set_name = req.body.old_set_name;
	link_list = req.body.link_list.split(", ");

	if (!sets[new_set_name]) {
		delete sets[old_set_name];
	}
	sets[new_set_name] = link_list;

	res.redirect('/sets/' + new_set_name);
})

app.get('/sets/new', function(req, res) {
	res.render('new');
})

app.get('/sets/:name', function(req, res) {
	set_name = req.params.name;

	link_list = sets[set_name];
	if (link_list) {
		res.render('show', {set_name: set_name, link_list: link_list});
	} else {
		res.send("No set found.");
	}
})

app.get('/sets/:name/edit', function(req, res) {
	set_name = req.params.name;	
	str_link_list = sets[set_name].join(", ");
	res.render('edit', {set_name: set_name, link_list: str_link_list});
})