Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home'
  });
  this.route('game', {
    path: 'game/:seed',
    template: 'game',
    waitOn: function () {
      return Meteor.subscribe('singleGame', this.params.seed);
    },
    data: function () {
      return Games.findOne({ seed: this.params.seed });
    }
  });
});
