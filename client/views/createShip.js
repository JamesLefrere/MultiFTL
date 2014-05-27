Template.createShip.helpers({
});

Template.createShip.events({
  'submit #createShip': function (e, t) {
    e.preventDefault();
    var name = t.$('#createShipName').val();
    Meteor.call('createShip', { name: name, game: Router.getData().game._id }, function (err, res) {
      if (!err) {
        console.log(res);
      } else console.log(err);
    });
  }
});