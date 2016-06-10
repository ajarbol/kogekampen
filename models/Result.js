var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Competition Model
 * ==========
 */

var Result = new keystone.List('Result');

Result.add({
		competition: { type: Types.Relationship, initial: true, ref: 'Event', required: true },
		wod: { type: Types.Relationship, filters: { competition: ':competition' }, ref: 'Wod' },
		team: { type: Types.Relationship, filters: { competition: ':competition' }, ref: 'Team' }
	},
	'AMRAP', {
		rounds: { type: Types.Number },
		reps: { type: Types.Number }
	},
	'forTime', {
		time: { type: Types.Text },
		hasCap: { type: Types.Boolean, default: false},
		capReps: { type: Types.Number }
	},
	'forLoad', {
		load: { type: Types.Text }
	});

Result.defaultColumns = 'event, wod, team, score';
Result.register();
