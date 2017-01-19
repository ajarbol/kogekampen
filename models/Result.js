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
		team: { type: Types.Relationship, filters: { competition: ':competition' }, ref: 'Team' },
	},
	'AMRAP', {
		rounds: { type: Types.Number },
		reps: { type: Types.Number }
	},
	'forTime (mm:ss)', {
		time: { type: Types.Text },
		hasCap: { type: Types.Boolean, default: false},
		capReps: { type: Types.Number }
	},
	'forReps', {
		aloneReps: { type: Types.Number }
	},
	'forLoad (kg)', {
		load: { type: Types.Text }
	},
	'triplet (A + B + C)', {
		score: {
			type: Types.List,
			fields: {  
				time: { type: Types.Text },
				hasCap: { type: Types.Boolean, default: false},
				capReps: { type: Types.Number }
			}
		}
	});

Result.defaultColumns = 'competition, wod, team';
Result.register();
