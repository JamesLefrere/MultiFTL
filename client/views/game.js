Template.game.created = function () {
  Session.setDefault('viewMode', false);
};

Template.game.helpers({
  microView: function () {
    return Session.get('viewMode');
  },
  createdShip: function () {
    return Session.get('myShip') === undefined;
  }
});

Template.game.events({

});
