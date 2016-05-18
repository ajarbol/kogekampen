var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Competition Model
 * ==========
 */

var Athlete = new keystone.List('Athlete');

Athlete.add({
	competition: { type: Types.Relationship, ref: 'Event', initial: true },
	name: { type: Types.Text, initial: true },
	division: { type: Types.Select, initial: true, options: ['rx', 'scaled'] },
	gender: { type: Types.Select, initial: true, options: ['male', 'female'] },
	customImage: { type: Types.Text, label: 'Facebook Id' },
	accepted: { type: Types.Boolean, default: true },
	timestamp: { type: Types.Datetime, default: Date.now, readonly: true }
});


/**
 * Registration
 */

Athlete.defaultColumns = 'name, division, competition, accepted, timestamp';
Athlete.defaultSort = '-timestamp';
Athlete.register();
