var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Competition Model
 * ==========
 */

var Team = new keystone.List('Team');

Team.add({
	competition: { type: Types.Relationship, initial: true, ref: 'Event', required: true },
	name: { type: Types.Text, initial: true, required: true },
	division: { type: Types.Select, initial: true, options: ['rx', 'scaled'], required: true },
	athletes: { type: Types.Relationship, ref: 'Athlete', filters: { competition: ':competition', division: ':division'  }, many: true }
});

Team.defaultColumns = 'name, competition, division';
Team.register();
