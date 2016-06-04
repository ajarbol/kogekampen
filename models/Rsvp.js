var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Competition Model
 * ==========
 */

var Rsvp = new keystone.List('Rsvp');

Rsvp.add({
	event: { type: Types.Relationship, ref: 'Event' },
	name: { type: Types.Text, initial: true },
	phone: { type: Types.Text, initial: true },
	paid: { type: Types.Boolean, default: false },
	timestamp: { type: Types.Datetime, default: Date.now, noedit: true }
});


/**
 * Registration
 */

Rsvp.defaultColumns = 'name, phone, paid, event, timestamp';
Rsvp.register();
