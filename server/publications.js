Meteor.publish('singleGame', function (seed) {
  return Games.find({ seed: seed });
});