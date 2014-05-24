SeedRandom = Meteor.require('seedrandom');

Meteor.methods({
  'createGame': function (data) {
    var self = this;

    if (typeof data.seed !== 'string' || typeof data !== 'object')
      throw new Meteor.Error(400, 'No data received');

    self.seed = SeedRandom(data.seed);
    self.time = (new Date()).getTime();
    self.slug = _.slugify(data.seed);

    var game = Games.insert({
      creator: self.userId,
      seedString: data.seed,
      seedValue: self.seed(),
      time: self.time,
      slug: self.slug
    });

    if (typeof game !== 'undefined') {
      return self.slug;
    } else throw new Meteor.Error(403, 'Something went wrong');

  }
});