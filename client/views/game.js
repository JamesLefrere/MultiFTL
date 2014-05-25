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

Template.game.rendered = function () {
  var self = this;
  self.$game = $('#game');
  self.gameWidth = self.$game.data('width');
  self.gameHeight = self.$game.data('height');

  var panZoom = svgPanZoom('#game', {
    zoomEnabled: false,
    minZoom: 1,
    maxZoom: 1
  });
  panZoom.setOnPan(function () {
    // @todo: remove magic numbers
    var maxRight = 0;
    var maxLeft = -self.gameWidth + 800;
    var maxTop = 0;
    var maxBottom = -self.gameHeight + 600;
    if (this.getPan().x > maxRight)
      this.pan({x: maxRight, y: this.getPan().y});
    if (this.getPan().x < maxLeft)
      this.pan({x: maxLeft, y: this.getPan().y});
    if (this.getPan().y > maxTop)
      this.pan({x: this.getPan().x, y: maxTop});
    if (this.getPan().y < maxBottom)
      this.pan({x: this.getPan().x, y: maxBottom});
  });
};