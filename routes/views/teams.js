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

var totalAllowed = 45;

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

          var rxSubs = rxAthletes.male.concat(rxAthletes.female).sort(sortByTime);
          var scaledSubs = scaledAthletes.male.concat(scaledAthletes.female).sort(sortByTime);

          var totalSubsCount = rxSubs + scaledSubs;
          var excess = totalAllowed - totalSubsCount;

          var allowedRx = excess > 0 ? Math.ceil((totalAllowed / 2) - excess) : Math.ceil(totalAllowed / 2);
          var allowedScaled = excess > 0 ? Math.floor((totalAllowed / 2) - excess) : Math.floor(totalAllowed / 2);

          var nonWaitlistRx = rxSubs.slice(0, allowedRx).sort(sortByTime);
          var nonWaitlistScaled = scaledSubs.slice(0, allowedScaled).sort(sortByTime);

          locals.rxAthletes = splitInHalf(nonWaitlistRx);
          locals.scaledAthletes = splitInHalf(nonWaitlistScaled);

          var totalRx = rxAthletes.male.length + rxAthletes.female.length;
          var totalScaled = scaledAthletes.male.length + scaledAthletes.female.length;
          
          var waitlistRx = rxSubs.slice(allowedRx, totalRx).sort(sortByTime);
          var waitlistScaled = scaledSubs.slice(allowedScaled, totalScaled).sort(sortByTime);

          if (waitlistRx.length) locals.rxWaitlist = splitInHalf(waitlistRx);
          if (waitlistScaled.length) locals.scaledWaitlist = splitInHalf(waitlistScaled);

          next();
        });
    }
  });
  
  // Render the view
  view.render('teams');
  
};
