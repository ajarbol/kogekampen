var keystone = require('keystone');
var _ = require('underscore');

var Result = keystone.list('Result');
var Wod = keystone.list('Wod');
var Team = keystone.list('Team');
var Event = keystone.list('Event');

var defaultResult = function (teams){
	var obj = { rx: [], scaled: [] };
	_.each(teams, function (team){
		obj[team.division][team._id] = {
			name: team.name,
			text: '',
			score: 0.0
		};
	});
	return obj;
};

var scoreForTime = function (result) {
  var split = result.time.split(':');
  if (split.length === 2) {
    var sec = ((+split[0]) * 60) + (+split[1]);
    if (result.hasCap) {
      sec = result.capReps ? sec + Math.pow(result.capReps + 1, -1)  : sec + 1;
    }
    return Math.pow(sec, -1);
  }
  else return 0;
}

var scoreTeam = function (type, result, _variation) {
  _variation = _variation || 0;
  switch (type) {
    case 'forTime':
      if (result.time) {
        return scoreForTime(result);
      }
      else if (result.score.length) {
        return scoreForTime(result.score[_variation]);
      } 
      else return 0;
      break;
    case 'forReps':
      return result.aloneReps || 0;
    case 'forLoad':
      return result.load || 0;
    case 'amrap':
      if (result.rounds) {
        return result.reps ? result.rounds - Math.pow(result.reps, -1) : result.rounds;
      } else return 0;
  }
};

var resultText = function (type, result, _variation) {
    _variation = _variation || 0;
    switch (type) {
      case 'forTime':
        var res = {};
        if (result.time) {
          res = result;
        } else if (result.score.length) {
          res = result.score[_variation];
        }
        return res.hasCap ? 'cap' + (res.capReps && res.capReps !== 0 ? ' +' + res.capReps : '' ) : res.time;
      case 'forReps':
        return result.points + ' reps';
      case 'forLoad':
        return result.load + 'kg';
      case 'amrap':
        return result.rounds + (result.rounds === 1 ? ' round' : ' rounds') + (result.reps && result.reps !== 0 ? ' +' + result.reps : '' );
    }
};

var buildResults = function (wod, result, _variation) {
  _variation = _variation || 0;
  _.each(wod.results, function(rs){
    if (rs[result.team]) {
      rs[result.team].score = scoreTeam(wod.type, result, _variation);
      rs[result.team].text = resultText(wod.type, result, _variation);
    }
  });
};

var getOrdinal = function (n) {
    var s = ['th','st','nd','rd'],
    v = n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
};

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'resultater';
	locals.showBackToHome = true;
	locals.showHeaderInitial = true;

	locals.wods = {};

	locals.masterOrder = { rx: {}, scaled: {} };

	view.on('init', function(next) {
		if (req.params.competition) {
			Event.model.findOne()
				.where('key', req.params.competition)
				.exec(function(err, c){
					if (err) return res.err(err);
        	if (!c) return res.notfound('Sorry, this competition no longer exists (404)');
					locals.competition = c;
					next();
				});
		} else next();
	});

	view.on('init', function(next) {
		if (locals.competition) {
			Team.model.find()
				.where('competition', locals.competition)
				.sort('name')
				.exec(function(err, teams){
					Wod.model.find()
						.where('competition', locals.competition)
						.sort('order')
						.exec(function(err, wods){
							_.each(wods, function(wod, i){
								var num = i + 1;
								switch(wod.type) {
									case 'forTime + forReps':
										locals.wods[wod._id + 'a'] = {
											name: 'WOD'+num+'a',
											type: 'forTime',
											results: defaultResult(teams)
										};
										locals.wods[wod._id + 'b'] = {
											name: 'WOD'+num+'b',
											type: 'forReps',
											results: defaultResult(teams)
										};
                    break;
									case 'forLoad + amrap':
										locals.wods[wod._id + 'a'] = {
											name: 'WOD'+num+'a',
											type: 'forLoad',
											results: defaultResult(teams)
										};
										locals.wods[wod._id + 'b'] = {
											name: 'WOD'+num+'b',
											type: 'amrap',
											results: defaultResult(teams)
										};
										break;
                  case 'triplet':
                  	_.each(['a', 'b', 'c'], function(n) {
	                    locals.wods[wod._id + n] = {
	                      name: 'WOD'+num+n,
	                      type: 'forTime',
	                      results: defaultResult(teams)
	                    };
	                  });
                    break;
									default:
										locals.wods[wod._id] = {
											name: 'WOD'+num,
											type: wod.type,
											results: defaultResult(teams)
										};
										break;
								}
							});
							next();
						});
					});
		}
		else next();
	});

	view.on('init', function(next) {
		if (!_.isEmpty(locals.wods)) {
			Result.model.find()
				.where('competition', locals.competition)
				.exec(function(err, results){
					_.each(results, function(result) {
						_.each([result.wod, result.wod + 'a', result.wod + 'b', result.wod + 'c'], function (id, v) {
							if (locals.wods[id]) buildResults(locals.wods[id], result, v-1);
						});
					});
					_.each(locals.wods, function (wod){
						_.each(wod.results, function(rs, division){
							var sortable = [];
							for (var i in rs) {
								sortable.push(rs[i]);
							}
							wod.results[division] = sortable.sort(function(a, b) {return b.score - a.score;});
							var position = 1;
							_.each(wod.results[division], function(r, i){
								if (wod.results[division][i-1]) {
									if (r.score !== wod.results[division][i-1].score) position++;
								}
								r.position = getOrdinal(position);
								locals.masterOrder[division][r.name] = locals.masterOrder[division][r.name] ? locals.masterOrder[division][r.name] + position : position;
							});
						});
					});
					_.each(locals.masterOrder, function(teams, division){
						var ts = [];
						_.each(teams, function(value, name){
							ts.push({name: name, value: value});
						});
						ts.sort(function(a, b){
							if (a.value < b.value)
								return -1;
							else if (a.value > b.value)
								return 1;
							else 
								return 0;
						});
						var position = 1;
						_.each(ts, function(t, i){
							if (ts[i-1]) {
								if (t.value !== ts[i-1].value) position++;
							}
							t.position = getOrdinal(position);
						});
						locals.masterOrder[division] = ts;
					});
					next();
				});
		}
		else next();
	});
	
	// Render the view
	view.render('results');
};
