var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Competition Model
 * ==========
 */

var Results = new keystone.List('Results');

Results.add({
	competition: { type: Types.Relationship, initial: true, ref: 'Event', required: true },
	wod: { type: Types.Relationship, filters: { competition: ':competition' }, ref: 'Wod' },
	team: { type: Types.Relationship, filters: { competition: ':competition' }, ref: 'Team' },
	score: { type: Types.Text }
});

Results.defaultColumns = 'event, wod, team, score';
Results.register();
