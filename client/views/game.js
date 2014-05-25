Template.game.helpers({
  connections: function () {
    if (typeof Session.get('currentBeacon') !== 'undefined' && typeof this.beacons !== 'undefined') {
      var beacons = [];
      var currentBeacon = this.beacons[Session.get('currentBeacon')];
      _.each(this.beacons, function (beacon) {
        if (Math.pow(beacon.x - currentBeacon.x, 2) + Math.pow(beacon.y - currentBeacon.y, 2) <= 400*400)
          beacons.push({ cx: currentBeacon.x, cy: currentBeacon.y, x: beacon.x, y: beacon.y });
      });
      return beacons;
    }
  },
  selected: function () {
    if (typeof Session.get('currentBeacon') !== 'undefined') {
      return Session.get('currentBeacon') === this.id;
    }
  }
});

Template.game.events({
  'mouseenter .beacon': function (e) {
    Session.set('currentBeacon', $(e.currentTarget).data('id'));
  }
});