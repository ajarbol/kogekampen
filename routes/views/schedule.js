var keystone = require('keystone');

var Event = keystone.list('Event');
var Schedule = keystone.list('Schedule');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'tidsplan';
  locals.title = 'Tidsplan';
  locals.showBackToHome = true;
  locals.showHeaderInitial = true;

  view.on('init', function(next) {
    Event.model.findOne()
      .where('key', req.params.competition)
      .exec(function(err, c){
        if (err) return res.err(err);
        if (!c) return res.notfound('Sorry, this competition no longer exists (404)');
        locals.competition = c;
        next();
      });
  });

  view.on('init', function(next) {
    Schedule.model.find()
      .where('competition', locals.competition)
      .sort('startTime')
      .exec(function (err, schedules) {
        locals.schedules = schedules.map(s => {
          var d = new Date(s.startTime);
          return {
            startTime: `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours() + ''}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes() + ''}`,
            text: s.text
          };
        });
        next();
      });
  });

  // Render the view
  view.render('schedule');
  
};
