Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home'
  });
  this.route('game', {
    path: 'game/:slug',
    template: 'game',
    waitOn: function () {
      return Meteor.subscribe('singleGame', this.params.slug);
    },
    data: function () {
      var game = Games.findOne({ slug: this.params.slug });
      Meteor.subscribe('singleGameShips', game._id);
      var ships = Ships.find().fetch();
      var myShip = _.findWhere(ships, { owner: Meteor.userId() });
      Session.set('myShip', myShip);
      if (typeof myShip !== 'undefined')
        Session.set('currentBeacon', myShip.beacon.id);
      return {
        game: game,
        ships: ships
      };
    }
  });
});
