Template.macro.helpers({
  myShip: function () {
    return Session.get('myShip');
  },
  connections: function () {
    if (typeof Session.get('selectedBeacon') !== 'undefined' && typeof this.game !== 'undefined') {
      var beacons = [];
      var selectedBeacon = this.game.beacons[Session.get('selectedBeacon')];
      _.each(this.game.beacons, function (beacon) {
        if (Math.pow(beacon.x - selectedBeacon.x, 2) + Math.pow(beacon.y - selectedBeacon.y, 2) <= 400*400)
          beacons.push({ cx: selectedBeacon.x, cy: selectedBeacon.y, x: beacon.x, y: beacon.y });
      });
      return beacons;
    }
  },
  isSelected: function () {
    if (typeof Session.get('selectedBeacon') !== 'undefined') {
      return Session.get('selectedBeacon') === this.id;
    }
  },
  isCurrent: function () {
    if (typeof Session.get('currentBeacon') !== 'undefined') {
      return Session.get('currentBeacon') === this.id;
    }
  },
  selectedBeacon: function () {
    if (typeof Session.get('selectedBeacon') !== 'undefined' && typeof this.game !== 'undefined') {
      return this.game.beacons[Session.get('selectedBeacon')];
    }
  },
  currentBeacon: function () {
    if (typeof Session.get('currentBeacon') !== 'undefined' && typeof this.game !== 'undefined') {
      return this.game.beacons[Session.get('currentBeacon')];
    }
  }
});

Template.macro.events({
  'mouseenter .beacon': function (e) {
    Session.set('selectedBeacon', $(e.currentTarget).data('id'));
  },
  'click .beacon': function (e) {
    Session.set('currentBeacon', $(e.currentTarget).data('id'));
    // @todo: validate the move with the server
    Meteor.call('move', {
      ship: Session.get('myShip'),
      destination: Session.get('currentBeacon')
    }, function (err, res) {
      if (!err) {
        console.log('Moved the ship');
        Session.set('currentView', 'micro');
      } else console.log(err);
    });
  }
});

Template.macro.rendered = function () {
  var self = this;
  self.$game = $('#game');
  self.gameWidth = self.$game.data('width');
  self.gameHeight = self.$game.data('height');

  window.gamePanZoom = svgPanZoom('#game', {
    zoomEnabled: false,
    minZoom: 1,
    maxZoom: 1
  });
  window.gamePanZoom.enablePan();
  window.gamePanZoom.enableDrag();
  window.gamePanZoom.enableZoom();
  window.gamePanZoom.setOnPan(function () {
    // @todo: remove magic numbers
    var pan = this.getPan();
    var maxRight = 0;
    var maxLeft = -self.gameWidth + 800;
    var maxTop = 0;
    var maxBottom = -self.gameHeight + 600;
    if (pan.x > maxRight) {
      this.pan({x: maxRight, y: pan.y});
    }
    else if (pan.x < maxLeft) {
      this.pan({x: maxLeft, y: pan.y});
    }
    else if (pan.y > maxTop) {
      this.pan({x: pan.x, y: maxTop});
    }
    else if (pan.y < maxBottom) {
      this.pan({x: pan.x, y: maxBottom});
    }
  });
};