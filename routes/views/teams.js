var keystone = require('keystone');
var _ = require('underscore');

var Event = keystone.list('Event');
var Athlete = keystone.list('Athlete');
var Team = keystone.list('Team');

var splitInHalf = function(arr) {
  var splitArr = [[],[]];
  _.each(arr, function (e, i){
    if (i % 2) splitArr[1].push(e);
    else splitArr[0].push(e);
  });
  return splitArr;
};

var sortByTime = function(a, b){
  return new Date(a.timestamp) - new Date(b.timestamp);
};

exports = module.exports = function(req, res) {
  
  var view = new keystone.View(req, res);
  var locals = res.locals;
  
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'teams';
  locals.title = 'Teams';
  locals.showBackToHome = true;
  locals.showHeaderInitial = true;

  view.on('init', function(next) {
    Event.model.findOne()
      .where({'key': req.params.competition})
      .exec(function(err, c){
        if (err) return res.err(err);
        if (!c) return res.notfound('Sorry, this competition no longer exists (404)');
        if (!c.showAthleteSection) return res.notfound('Sorry, there are no teams for this competition (404)');

        locals.competition = c;

        next();
      });
  });

  view.on('init', function(next) {
    if (locals.competition.showTeams) {
      Team.model.find()
        .where('competition', locals.competition)
        .populate('athletes')
        .sort('name')
        .exec(function (err, teams) {
          var rxTeams = [];
          var scaledTeams = [];
          _.each(teams, function (team) {
            if (team.athletes.length) {
              if (team.division === 'rx') {
                rxTeams.push(team);
              }
              else if (team.division === 'scaled') {
                scaledTeams.push(team);
              }
            }
          });
          locals.rxTeams = rxTeams;
          locals.scaledTeams = scaledTeams;
          next();
        });
    }
    else {
      locals.title = 'Tilmeldinger';
      Athlete.model.find()
        .where('competition', locals.competition)
        .where('accepted', true)
        .sort('timestamp')
        .exec(function (err, athletes) {
          var rxAthletes = { male: [], female: [] };
          var scaledAthletes = { male: [], female: [] };
          _.each(athletes, function (athlete) {
            if (athlete.division === 'rx') {
              rxAthletes[athlete.gender].push(athlete);
            }
            else if (athlete.division === 'scaled') {
              scaledAthletes[athlete.gender].push(athlete);
            }
          });

          var nonWaitlistRx = rxAthletes.male.slice(0, 18).concat(rxAthletes.female.slice(0, 9)).sort(sortByTime);
          var nonWaitlistScaled = scaledAthletes.male.slice(0, 18).concat(scaledAthletes.female.slice(0, 9)).sort(sortByTime);

          locals.rxAthletes = splitInHalf(nonWaitlistRx);
          locals.scaledAthletes = splitInHalf(nonWaitlistScaled);
          
          var waitlistRx = rxAthletes.male.slice(18, rxAthletes.male.length).concat(rxAthletes.female.slice(9, rxAthletes.female.length)).sort(sortByTime);
          var waitlistScaled = scaledAthletes.male.slice(18, scaledAthletes.male.length).concat(scaledAthletes.female.slice(9, scaledAthletes.female.length)).sort(sortByTime);

          if (waitlistRx.length) locals.rxWaitlist = splitInHalf(waitlistRx);
          if (waitlistScaled.length) locals.scaledWaitlist = splitInHalf(waitlistScaled);

          next();
        });
    }
  });
  
  // Render the view
  view.render('teams');
  
};
