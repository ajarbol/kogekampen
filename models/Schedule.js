var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Competition Model
 * ==========
 */

var Schedule = new keystone.List('Schedule');

Schedule.add({
	competition: { type: Types.Relationship, initial: true, ref: 'Event', required: true },
	startTime: { type: Types.Datetime, initial: true, required: true },
	endTime: { type: Types.Datetime, initial: true, required: true },
	text: { type: Types.Text, initial: true, required: true  },
  requiredTeams: { type: Types.Relationship, ref: 'Team', filters: { competition: ':competition'  }, many: true }
});

Schedule.defaultColumns = 'competition, startTime, endTime, text';
Schedule.register();
