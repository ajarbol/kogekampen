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
	customImage: { type: Types.Text },
	accepted: { type: Types.Boolean, default: false },
	timestamp: { type: Types.Datetime, default: Date.now }
});


/**
 * Registration
 */

Athlete.defaultColumns = 'name, division, competition, timestamp';
Athlete.register();
