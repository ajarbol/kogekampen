var keystone = require('keystone');
var https = require('https');
var utils = require('../utils');

var Rsvp = keystone.list('Rsvp');
var Event = keystone.list('Event');

exports = module.exports = function(req, res) {

	if (!req.body.eventId) return res.status(400);

	if (!req.body.name) return res.status(400).json({'error': 'Du mangler dit navn...'});
	if (!req.body.phone) return res.status(400).json({'error': 'Du mangler dit telefon nummer...'});

	Event.model.findById(req.body.eventId, function(err, event) {

		if (err) return res.err(err);
		if (!event) return res.notfound('Event not found');

		if (event.googleFormId) {
			var data = {
				'entry.2103811410': req.body.name,
				'entry.1475078930': req.body.phone
			};
			var options = {
				method: 'POST',
			  	host: 'docs.google.com',
			  	path: '/forms/d/'+event.googleFormId+'/formResponse?' + utils.serialize(data)
			};
			https.request(options).end();
		}

		var model = new Rsvp.model({
			name: req.body.name,
			phone: req.body.phone,
			event: req.body.eventId
		});

		model.save(function(err) {
			if(err) {
				return res.apiError('api', 'Error saving rsvp', err, 400);
			} else {
				return res.json({'status': 'ok'});
			}
		});
	});
};
