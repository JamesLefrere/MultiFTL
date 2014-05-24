SeedRandom = Meteor.require('seedrandom');

Meteor.methods({
  'createGame': function (data) {
    var self = this;

    if (typeof data.seed !== 'string' || typeof data !== 'object')
      throw new Meteor.Error(400, 'No data received');

    self.rng = SeedRandom(data.seed);
    self.seedValue = self.rng();
    self.seedString = data.seed;
    self.slug = _.slugify(self.seedString);
    self.time = (new Date()).getTime();

    self.beacons = [];
    self.gameWidth = 800;
    self.gameHeight = 600;

    for (var i = 0; i < 16; i++) {
      var x = self.rng() * self.gameWidth;
      var y = self.rng() * self.gameHeight;
      self.beacons.push({x: x, y: y});
    }

    var game = Games.insert({
      creator: self.userId,
      seedValue: self.seedValue,
      seedString: self.seedString,
      slug: self.slug,
      time: self.time,
      beacons: self.beacons
    });

    if (typeof game !== 'undefined') {
      return self.slug;
    } else throw new Meteor.Error(403, 'Something went wrong');

  }
});