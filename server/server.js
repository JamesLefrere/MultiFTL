SeedRandom = Meteor.require('seedrandom');

Meteor.methods({
  'createGame': function (data) {
    var self = this;

    if (typeof data.seed !== 'string' || typeof data !== 'object')
      throw new Meteor.Error(400, 'No data received');

    if (data.seed !== 'undefined') {
      self.seed = SeedRandom(data.seed);
    } else {
      self.seed = SeedRandom();
    }

    self.time = (new Date()).getTime();

    var game = Games.insert({
      creator: self.userId,
      seed: self.seed,
      time: self.time,
      slug: _.slugify(self.seed)
    });

    if (typeof game !== 'undefined') {
      return game.slug;
    } else throw new Meteor.Error(403, 'Something went wrong');

  }
});