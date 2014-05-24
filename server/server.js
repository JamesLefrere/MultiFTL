SeedRandom = Meteor.require('seedrandom');

Meteor.methods({
  'createGame': function (data) {
    var self = this;

    if (data.seed !== 'string' || typeof data !== 'object')
      throw Meteor.Error(400, 'No data received');

    if (data.seed !== 'undefined') {
      self.seed = SeedRandom(data.seed);
    } else {
      self.seed = SeedRandom();
    }

    self.time = (new Date()).getTime();

    Games.insert({
      creator: self.userId,
      seed: self.seed,
      time: self.time
    });
  }
});