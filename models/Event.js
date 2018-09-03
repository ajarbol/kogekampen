var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Event Model
 * ==========
 */

var Event = new keystone.List('Event', {
	autokey: { from: 'name', path: 'key', unique: true }
});

var localStorage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: 'public/uploads',
    publicPath: '/public',
  },
});

var imageType = { type: Types.File, storage: localStorage };

/*var imageType = {
	type: Types.LocalFile,
	dest: 'public/uploads'
}*/

Event.add({
	name: { type: Types.Text, initial: true },
	type: { type: Types.Select, initial: true, options: ['workout', 'social'] },
	prettyTime: { type: Types.Text },
	startTime: { type: Types.Datetime, default: Date.now },
	endTime: { type: Types.Datetime, default: Date.now },
	googleFormId: { type: Types.Text },
	googleMapsApi: { type: Types.Text },
	ticketUrl: { type: Types.Text },
	description: { type: Types.Html, wysiwyg: true },
	location: { type: Types.Location },
	coverImage: imageType,
	logoImage: imageType,
	socialBanner: imageType,
	rxRequirements: { type: Types.Html, wysiwyg: true },
	scaledRequirements: { type: Types.Html, wysiwyg: true },
	showResultSection: { type: Types.Boolean, default: false },
	showAthleteSection: { type: Types.Boolean, default: false },
	showTeams: { type: Types.Boolean, default: false },
	bodyLabBanner: { type: Types.Boolean, default: false },
	noccoBanner: { type: Types.Boolean, default: false },
	barebellsBanner: { type: Types.Boolean, default: false },
	kimsBanner: { type: Types.Boolean, default: false },
	clnBanner: { type: Types.Boolean, default: false }
});

Event.relationship({ path: 'wods', ref: 'Wod', refPath: 'competition', many: true });
Event.relationship({ path: 'teams', ref: 'Team', refPath: 'competition', many: true });

Event.defaultColumns = 'name, startTime';
Event.register();
