Template.micro.helpers({
  myShip: function () {
    return Session.get('myShip');
  },
  otherShipsHere: function () {
    return Ships.find({
      'beacon.id': Session.get('currentBeacon'),
      owner: {
        $ne: Meteor.userId()
      }
    }).fetch();
  }
});

Template.micro.events({

});

Template.micro.rendered = function () {
  window.gamePanZoom.disablePan();
  window.gamePanZoom.disableDrag();
  window.gamePanZoom.disableZoom();
  $('.viewport').removeAttr('transform');
};