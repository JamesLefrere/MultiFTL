SeedRandom = Meteor.require('seedrandom');

var vocabulary = {
  phonemes: {},
  greek: {},
  adjectives: {}
};
vocabulary.phonemes = JSON.parse(Assets.getText('phonemes.json'));
vocabulary.greek = JSON.parse(Assets.getText('greek.json'));
vocabulary.adjectives = JSON.parse(Assets.getText('adjectives.json'));

var RandomName = function (rng, category) {
  if (typeof rng !== 'number' || typeof category !== 'string')
    throw new Meteor.Error(500, 'Could not generate name');

  var self = this;
  self.rng = new SeedRandom(rng);
  self.name = '';

  self.getFragment = function (options) {
    var fragment = '';
    for (i = 0; i < options.segments; i++) {
      var corpusLength = options.corpus.length;
      var randomEntry = Math.floor(self.rng() * corpusLength);
      fragment += options.corpus[randomEntry];
    }
    if (options.titleCase)
      fragment = _.str.capitalize(fragment);
    if (options.separator)
      fragment += options.separator;
    self.name += fragment;
  };

  self.getName = function () {
    return self.name;
  };

  switch (category) {
    case 'beacon':
      self.getFragment({ segments: 2, corpus: vocabulary.phonemes, titleCase: true, separator: ' ' });
      self.getFragment({ segments: 1, corpus: vocabulary.greek });
      break;
    case 'weapon':
      self.getFragment({ segments: 2, corpus: vocabulary.adjectives, titleCase: true, separator: ' ' });
      break;
  }

};

var BeaconGenerator = function (rng, gameWidth, gameHeight, count) {
  var self = this;
  self.rng = new SeedRandom(rng);
  self.beacons = [];

  for (var i = 0; i < count; i++) {
    var x = self.rng() * gameWidth;
    var y = self.rng() * gameHeight;
    var name = new RandomName(self.rng(), 'beacon');
    self.beacons.push({id: i, name: name.getName(), x: x, y: y});
  }

  self.getBeacons = function () {
    return self.beacons;
  }
};

var WeaponGenerator = function (rng, category) {
  var self = this;
  self.rng = new SeedRandom(rng);
  self.weapon = {
    name: (new RandomName(self.rng(), 'weapon')).getName() + category,
    // @todo: balance these numbers
    damage: Math.round(self.rng() * 2),
    rate: Math.round(self.rng() * 10000),
    value: Math.round(self.rng() * 100)
  };
  self.getWeapon = function () {
    return self.weapon;
  }
};

Meteor.methods({
  'createGame': function (data) {
    var self = this;

    if (typeof data.seed !== 'string' || typeof data !== 'object')
      throw new Meteor.Error(400, 'No data received');

    self.rng = new SeedRandom(data.seed);
    self.seedValue = self.rng();
    self.seedString = data.seed;
    self.slug = _.slugify(self.seedString);
    self.time = (new Date()).getTime();
    // @todo: remove magic numbers
    self.beacons = (new BeaconGenerator(self.rng(), 3000, 2000, 128)).getBeacons();

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
    } else throw new Meteor.Error(500, 'Something went wrong');

  },
  'createShip': function (data) {
    var self = this;

    if (typeof data.name !== 'string' || typeof data.game !== 'string' || typeof data !== 'object')
      throw new Meteor.Error(400, 'No data received');

    self.rng = new SeedRandom(data.game.seedValue);

    // @todo: validate no existing ship name, game in progress, no existing ship for this player in this game

    var game = Games.findOne({_id: data.game});

    var ship = Ships.insert({
      owner: self.userId,
      name: data.name,
      game: data.game,
      beacon: game.beacons[Math.floor(Math.random()*game.beacons.length)], // purposely not PRNG
      // @todo: use these stats
      stats: {
        alive: true,
        hull: 30,
        fuel: 20,
        money: 10,
        arms: [
          // @todo: remove hardcoded category, make this do something
          (new WeaponGenerator(self.rng(), 'beam')).getWeapon(),
          (new WeaponGenerator(self.rng(), 'laser')).getWeapon()
        ],
        crew: 4
      }
    });

    if (typeof ship !== 'undefined') {
      return ship;
    } else throw new Meteor.Error(500, 'Something went wrong');
  },
  'move': function (data) {
    var self = this;

    if (typeof data.ship !== 'object' || typeof data.destination !== 'number')
      throw new Meteor.Error(400, 'No data received');

    self.game = Games.findOne(data.ship.game);
    if (typeof self.game === 'undefined')
      throw new Meteor.Error(404, 'Game not found');

    // @todo: validate ship properties
    if (data.ship.stats.fuel === 0)
      throw new Meteor.Error(403, 'No fuel, yo');

    // @todo: validate that destination is in range of origin
    self.beacon = self.game.beacons[data.destination];
    if (typeof self.beacon !== 'object')
      throw new Meteor.Error(404, 'Beacon not found in this game');

    if (data.ship.beacon.id === data.destination)
      throw new Meteor.Error(403, 'You’re already there, yo');

    Ships.update(data.ship._id, {
      $set: {
        beacon: self.beacon
      },
      $inc: {
        'stats.fuel': -1
      }
    });

    return data.ship;
  }
});
