var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Wod Model
 * ==========
 */

var Wod = new keystone.List('Wod');

Wod.add({
  name: { type: Types.Text, index: true },
	competition: { type: Types.Relationship, ref: 'Event', initial: true, required: true },
	order: { type: Types.Number, default: 0, initial: true, required: true },
	rxDescription: { type: Types.Html, wysiwyg: true },
	scaledDescription: { type: Types.Html, wysiwyg: true },
  rxVideoEmbedUrl: { type: Types.Url },
  scaledVideoEmbedUrl: { type: Types.Url },
	finisher: { type: Types.Boolean, default: false }, 
	released: { type: Types.Boolean, default: false },
	type: { type: Types.Select, initial: true, options: ['forTime', 'forLoad', 'forReps', 'amrap', 'forLoad + amrap', 'forTime + forReps', 'triplet'], required: true }

});

Wod.defaultColumns = 'name, competition, order, type, released';
Wod.defaultSort = 'competition, order';
Wod.register();
