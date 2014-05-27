Meteor.publish('singleGame', function (slug) {
  return Games.find({ slug: slug });
});

Meteor.publish('singleGameShips', function (gameId) {
  return Ships.find({ game: gameId });
});
