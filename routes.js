module.exports = exports = function(app, db) {
	var sets = new Object();

	app.get('/', function(req, res) {
		res.render('index', { layout: 'layout', title: 'Home'});
	})

	app.route('/sets')
	.get(function(req, res) {
		set_names = Object.keys(sets);

		res.render('sets', { layout: 'layout', title: 'Your Sets', sets: sets, set_names: set_names });
	})
	.post(function(req, res) {
		set_name = req.body.set_name;
		link_list = req.body.link_list.split(", ");
		sets[set_name] = link_list;
		res.redirect('/sets');
	})
	.put(function(req, res) {
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
	.delete(function(req, res) {
		set_name = req.body.set_name;
		delete sets[set_name];

		res.redirect('/sets');
	})

	app.get('/sets/new', function(req, res) {
		res.render('new', { layout: 'layout', title: 'New Set' });
	})

	app.get('/sets/:name', function(req, res) {
		set_name = req.params.name;

		link_list = sets[set_name];
		if (link_list) {
			res.render('show', { layout: 'layout', title: set_name, set_name: set_name, link_list: link_list});
		} else {
			res.send("No set found.");
		}
	})

	app.get('/sets/:name/edit', function(req, res) {
		set_name = req.params.name;	
		str_link_list = sets[set_name].join(", ");
		res.render('edit', { layout: 'layout', title: 'Edit Set', set_name: set_name, link_list: str_link_list});
	})
}