Meteor.publish('singleGame', function (slug) {
  return Games.find({ slug: slug });
});