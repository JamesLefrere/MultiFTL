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
      return Games.findOne({ slug: this.params.slug });
    }
  });
});
