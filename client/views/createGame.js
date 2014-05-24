Template.createGame.helpers({
  randomString: function () {
    return Math.random().toString(36).substring(8);
  }
});

Template.createGame.events({
  'submit #createGame': function (e, t) {
    e.preventDefault();
    var seed = t.$('#createGameSeed').val();
    Meteor.call('createGame', { seed: seed }, function (err, res) {
      if (!err) {
        Router.go('/game/' + res);
      } else console.log(err);
    });
  }
});