var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Wod Model
 * ==========
 */

var Wod = new keystone.List('Wod');

Wod.add({
	competition: { type: Types.Relationship, ref: 'Event', initial: true, required: true },
	order: { type: Types.Number, default: 0, required: true },
	name: { type: Types.Text },
	rxDescription: { type: Types.Html, wysiwyg: true },
	scaledDescription: { type: Types.Html, wysiwyg: true },
	finisher: { type: Types.Boolean, default: false }, 
	released: { type: Types.Boolean, default: false }
});

Wod.defaultColumns = 'competition, division, order, name, released';
Wod.defaultSort = 'competition, order';
Wod.register();
