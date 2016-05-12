var keystone = require('keystone');
var https = require('https');
var utils = require('../utils');

var Athlete = keystone.list('Athlete');
var Event = keystone.list('Event');

exports = module.exports = function(req, res) {

	if (!req.body.eventId) return res.status(400);

	if (!req.body.name) return res.status(400).json({'error': 'Du mangler dit navn...'});
	if (!req.body.gender) return res.status(400).json({'error': 'Du mangler at vælge køn...'});
	if (!req.body.division) return res.status(400).json({'error': 'Du mangler at vælge række...'});

	Event.model.findById(req.body.eventId, function(err, event) {

		if (err) return res.err(err);
		if (!event) return res.notfound('Event not found');

		if (event.googleFormId) {
			var data = {
				'entry.1498774012': req.body.name,
				'entry.310929253': req.body.gender === 'male' ? 'Mand' : 'Kvinde',
				'entry.845145300': req.body.division === 'rx' ? 'Rx' : 'Begynder'
			};
			var options = {
				method: 'POST',
			  	host: 'docs.google.com',
			  	path: '/forms/d/'+event.googleFormId+'/formResponse?' + utils.serialize(data)
			};
			https.request(options).end();
		}

		var model = new Athlete.model({
			name: req.body.name,
			division: req.body.division,
			gender: req.body.gender,
			competition: req.body.eventId
		});

		model.save(function(err) {
			if(err) {
				return res.apiError('api', 'Error saving athlete', err, 400);
			} else {
				return res.json({'status': 'ok'});
			}
		});
	});

};
