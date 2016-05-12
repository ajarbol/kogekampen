var keystone = require('keystone');
var _ = require('underscore');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'om-kogeriet';
	locals.showBackToHome = true;
	
	// Render the view
	view.render('omKogeriet');
	
};
