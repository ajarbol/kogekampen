var keystone = require('keystone');
var _ = require('underscore');

var Event = keystone.list('Event');
var Wod = keystone.list('Wod');

var Schedule = keystone.list('Schedule');

exports = module.exports = function(req, res) {
  
  var view = new keystone.View(req, res);
  var locals = res.locals;
  
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';

  view.on('init', function(next) {
    Event.model.findOne()
      .where({'key': req.params.competition})
      .exec(function(err, c){
        if (err) return res.err(err);
        if (!c) return res.notfound('Sorry, this competition no longer exists (404)');
        if (c.location && c.location.geo) {
          c.location.geoOffset = [c.location.geo[0]+0.01, c.location.geo[1]+0.02];
        }
        var now = new Date();
        var zoneAdjustedNow = (new Date()).setHours(now.getHours() - 1);
        locals.hasCountdown = c.startTime - zoneAdjustedNow > 0 ? true : false;
        locals.competition = c;

        if (c.bodyLabBanner || c.noccoBanner || c.barebellsBanner) {
          locals.competition.hasSponsor = true;
        } else {
          locals.competition.hasSponsor = false;
        }

        next();
      });
  });

  view.on('init', function(next) {
    Wod.model.find()
      .where('competition', locals.competition)
      .sort('order')
      .exec(function (err, wods) {
        locals.wods = wods.map(function(wod){
          if (wod.released) {
            return {
              name: wod.name,
              rx: {
                desc: wod.rxDescription,
                embedUrl: wod.rxVideoEmbedUrl || false
              },
              scaled: {
                desc: wod.scaledDescription,
                embedUrl: wod.scaledVideoEmbedUrl || false
              },
              finisher: wod.finisher,
              released: wod.released
            };
          }
          else {
            return {
              name: wod.name,
              finisher: wod.finisher,
              released: wod.released
            };
          }
        });
        next();
      });
  });

  var minutesDiff = function(t1, t2) {
    var diffMs = t1 - t2;
    return diffMs > 0 ? Math.round((diffMs * 0.001) / 60) : 0;
  };

  view.on('init', function(next) {
    var now = new Date();
    Schedule.model.find()
      .where('competition', locals.competition)
      .where('endTime', {$gte : now})
      .sort('endTime')
      .limit(3)
      .exec(function (err, schedules) {
        locals.schedules = [];
        _.each(schedules, function(schedule){
          locals.schedules.push({
            text: schedule.text,
            minutes: minutesDiff(new Date(schedule.startTime), now)
          });
        });
        next();
      });
  });
  
  // Render the view
  view.render('competition');
  
};
