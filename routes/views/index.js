var keystone = require('keystone');
var _ = require('underscore');

var Event = keystone.list('Event');
var Wod = keystone.list('Wod');
var Athlete = keystone.list('Athlete');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('init', function(next) {
		Event.model.findOne()
			.where({'type': 'workout'})
			.exec(function(err, c){
				if (err) return res.err(err);
				if (!c) return res.notfound('Event not found');
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

	var splitInHalf = function(arr) {
		var halfLength = Math.ceil(arr.length / 2);
		return [arr.splice(0,halfLength), arr]
	}

	view.on('init', function(next) {
		Athlete.model.find()
			.where('competition', locals.competition)
			.exec(function (err, athletes) {
				var rxAthletes = [];
				var scaledAthletes = [];
				_.each(athletes, function (athlete) {
					if (athlete.division === 'rx') {
						rxAthletes.push(athlete);
					}
					else if (athlete.division === 'scaled') {
						scaledAthletes.push(athlete);
					}
				})
				locals.rxAthletes = splitInHalf(rxAthletes);
				locals.scaledAthletes = splitInHalf(scaledAthletes);
				next();
			});
	});
	
	// Render the view
	view.render('index');
	
};
