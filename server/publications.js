Meteor.publish('singleGame', function (slug) {
  return Games.find({ url: slug });
});