Template.game.created = function () {
  Session.setDefault('viewMode', false);
};

Template.game.helpers({
  microView: function () {
    return Session.get('viewMode');
  }
});

Template.game.events({

});
