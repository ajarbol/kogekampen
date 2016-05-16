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
		var splitArr = [[],[]];
		_.each(arr, function (e, i){
			if (i % 2) splitArr[1].push(e)
			else splitArr[0].push(e);
		});
		return splitArr;
	}

	var sortByTime = function(a, b){
		return new Date(a.timestamp) - new Date(b.timestamp);
	}

	view.on('init', function(next) {
		Athlete.model.find()
			.where('competition', locals.competition)
			.where('accepted', true)
			.sort('timestamp')
			.exec(function (err, athletes) {
				var rxAthletes = { male: [], female: [] };
				var scaledAthletes = { male: [], female: [] };
				_.each(athletes, function (athlete) {
					if (athlete.division === 'rx') {
						rxAthletes[athlete.gender].push(athlete);
					}
					else if (athlete.division === 'scaled') {
						scaledAthletes[athlete.gender].push(athlete);
					}
				});

				var nonWaitlistRx = rxAthletes.male.slice(0, 18).concat(rxAthletes.female.slice(0, 9)).sort(sortByTime);
				var nonWaitlistScaled = scaledAthletes.male.slice(0, 18).concat(scaledAthletes.female.slice(0, 9)).sort(sortByTime);

				locals.rxAthletes = splitInHalf(nonWaitlistRx);
				locals.scaledAthletes = splitInHalf(nonWaitlistScaled);
				
				var waitlistRx = rxAthletes.male.slice(18, rxAthletes.male.length).concat(rxAthletes.female.slice(9, rxAthletes.female.length)).sort(sortByTime);
				var waitlistScaled = scaledAthletes.male.slice(18, scaledAthletes.male.length).concat(scaledAthletes.female.slice(9, scaledAthletes.female.length)).sort(sortByTime);

				if (waitlistRx.length) locals.rxWaitlist = splitInHalf(waitlistRx);
				if (waitlistScaled.length) locals.scaledWaitlist = splitInHalf(waitlistScaled);

				next();
			});
	});
	
	// Render the view
	view.render('index');
	
};
