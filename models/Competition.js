var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Competition Model
 * ==========
 */

var Competition = new keystone.List('Competition');

Competition.add({
	name: { type: Types.Text, initial: true },
	prettyTime: { type: Types.Text },
	startTime: { type: Types.Datetime, default: Date.now },
	endTime: { type: Types.Datetime, default: Date.now },
	googleFormId: { type: Types.Text },
	googleMapsApi: { type: Types.Text },
	description: { type: Types.Html, wysiwyg: true },
	location: { type: Types.Location },
	rxRequirements: { type: Types.Html, wysiwyg: true },
	scaledRequirements: { type: Types.Html, wysiwyg: true }
});


/**
 * Registration
 */

Competition.defaultColumns = 'name, startTime';
Competition.register();
