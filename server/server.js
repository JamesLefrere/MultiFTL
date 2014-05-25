SeedRandom = Meteor.require('seedrandom');

var phonemes = {};
var greek = {};
phonemes = JSON.parse(Assets.getText('phonemes.json'));
greek = JSON.parse(Assets.getText('greek.json'));

var NameGenerator = function (rng, category) {
  if (typeof rng !== 'number' || typeof category !== 'string')
    throw new Meteor.Error(500, 'Could not generate name');

  var self = this;
  self.rng = new SeedRandom(rng);
  self.name = '';

  self.getFragment = function (options) {
    var fragment = '';
    for (i = 0; i < options.segments; i++) {
      var corpusLength = options.corpus.length;
      var randomEntry = Math.round(self.rng() * corpusLength);
      if (randomEntry > corpusLength)
        randomEntry--;
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
      self.getFragment({ segments: 2, corpus: phonemes, titleCase: true, separator: ' ' });
      self.getFragment({ segments: 1, corpus: greek });
      break;
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

    self.beacons = [];
    self.gameWidth = 3000;
    self.gameHeight = 2000;

    for (var i = 0; i < 72; i++) {
      var x = self.rng() * self.gameWidth;
      var y = self.rng() * self.gameHeight;
      var name = new NameGenerator(self.rng(), 'beacon');
      self.beacons.push({id: i, name: name.getName(), x: x, y: y});
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
    } else throw new Meteor.Error(500, 'Something went wrong');

  }
});