var keystone = require('keystone');
var _ = require('underscore');

var Competition = keystone.list('Competition');
var Wod = keystone.list('Wod');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('init', function(next) {
		Competition.model.findOne()
			.exec(function(err, c){
				if (err) return res.err(err);
				if (!c) return res.notfound('Competition not found');
				if (c.location && c.location.geo) {
					c.location.geoOffset = [c.location.geo[0]+0.01, c.location.geo[1]+0.02];
				}
				locals.competition = c;
				next();
			});
	});

	view.on('init', function(next) {
		Wod.model.find()
			.where('competition', locals.competition)
			.sort('order')
			.exec(function (err, wods) {
				locals.wods = wods.map(function(wod){
					if (wod.released) {
						return {
							name: wod.name,
							rx: wod.rxDescription,
							scaled: wod.scaledDescription,
							finisher: wod.finisher,
							released: wod.released
						};
					}
					else {
						return {
							name: wod.name,
							finisher: wod.finisher,
							released: wod.released
						};
					}
				});
				next();
			});
	});
	
	// Render the view
	view.render('index');
	
};
