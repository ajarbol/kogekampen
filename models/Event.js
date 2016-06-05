var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Event Model
 * ==========
 */

var Event = new keystone.List('Event');

Event.add({
	name: { type: Types.Text, initial: true },
	type: { type: Types.Select, initial: true, options: ['workout', 'social'] },
	prettyTime: { type: Types.Text },
	startTime: { type: Types.Datetime, default: Date.now },
	endTime: { type: Types.Datetime, default: Date.now },
	googleFormId: { type: Types.Text },
	googleMapsApi: { type: Types.Text },
	description: { type: Types.Html, wysiwyg: true },
	location: { type: Types.Location },
	rxRequirements: { type: Types.Html, wysiwyg: true },
	scaledRequirements: { type: Types.Html, wysiwyg: true },
	showTeams: { type: Types.Boolean, default: false }
});

Event.defaultColumns = 'name, startTime';
Event.register();
