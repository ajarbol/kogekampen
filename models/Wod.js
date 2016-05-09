var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Wod Model
 * ==========
 */

var Wod = new keystone.List('Wod');

Wod.add({
	competition: { type: Types.Relationship, ref: 'Competition' },
	order: { type: Types.Number, default: 0 },
	name: { type: Types.Text },
	rxDescription: { type: Types.Html, wysiwyg: true },
	scaledDescription: { type: Types.Html, wysiwyg: true },
	finisher: { type: Types.Boolean, initial: false, default: false }, 
	released: { type: Types.Boolean, initial: false, default: false }
});


/**
 * Registration
 */

Wod.defaultColumns = 'competition, division, order, name, released';
Wod.register();
