module.exports = exports = function(app, db) {

	app.get('/', function(req, res) {
		res.render('index', { layout: 'layout', title: 'Home'});
	})

	app.route('/sets')
	.get(function(req, res) {

		db.collection('sets').find().toArray(function(err, items) {
			if (err) throw err;
			
			res.render('sets', { layout: 'layout', title: 'Your Sets',  sets: items });
		});
	})
	.post(function(req, res) {
		set_name = req.body.set_name;
		link_list = req.body.link_list.split(", ");

		db.collection('sets').insert({ set_name: set_name, link_list: link_list}, function(err, data){
				if(err) throw err;
				console.log("inserted: " + JSON.stringify(data));

				res.redirect('/sets');
			});
	})
	.put(function(req, res) {
		new_set_name = req.body.new_set_name;
		old_set_name = req.body.old_set_name;
		link_list = req.body.link_list.split(", ");

		db.collection('sets').remove({ set_name: old_set_name }, function(err, result){
			if (err) throw err;
		});

		db.collection('sets').insert({ set_name: new_set_name, link_list: link_list }, function(err, data) {
			if (err) throw err;
			console.log("inserted: " + JSON.stringify(data));

			res.redirect('/sets/' + new_set_name);
		});
	})
	.delete(function(req, res) {
		set_name = req.body.set_name;
		
		db.collection('sets').remove({ set_name: set_name }, function(err, result) {
			if (err) throw err;

			res.redirect('/sets');
		})
	})

	app.get('/sets/new', function(req, res) {
		res.render('new', { layout: 'layout', title: 'New Set' });
	})

	app.get('/sets/:name', function(req, res) {
		var set_name = req.params.name;

		db.collection('sets').findOne({ 'set_name': set_name }, function(err, item){
			if (item) {
				res.render('show', { layout: 'layout', title: set_name, set: item });
			} else {
				res.send("No set found.")
			}
		})
	})

	app.get('/sets/:name/edit', function(req, res) {
		var set_name = req.params.name;	
		
		db.collection('sets').findOne({ 'set_name': set_name }, function(err, item) {
			if (item) {
				res.render('edit', { layout: 'layout', title: 'Edit Set', set: item });
			} else {
				res.send("No set found.")
			}
		})
	})
}