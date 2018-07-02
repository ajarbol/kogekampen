var keystone = require('keystone');
var _ = require('underscore');

var Event = keystone.list('Event');
exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('init', function(next) {
		Event.model.find()
			.exec(function(err, cs){
				if (err) return res.err(err);
				locals.competitions = cs.sort(function(a,b){
				  // Turn your strings into dates, and then subtract them
				  // to get a value that is either negative, positive, or zero.
				  return new Date(b.startTime) - new Date(a.startTime);
				});
				next();
			});
	});
	
	// Render the view
	view.render('index');
	
};
