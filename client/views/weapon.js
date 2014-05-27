Template.weapon.created = function () {
  // @todo: use ID instead of name
  Session.set('charge-'+this.data.name, 0);
};

Template.weapon.destroyed = function () {
  Meteor.clearTimeout(this.weaponTimer);
};

Template.weapon.helpers({
  charge: function () {
    return Session.get('charge-'+this.name);
  }
});

Template.weapon.events({
  'click .charge': function (e) {
    e.preventDefault();
    var self = this;
    if (Session.get('charge-'+self.name) > 0)
      return false;

    console.log('Charging ' + self.name);
    self.weaponTimer = Meteor.setInterval(function () {
      Session.set('charge-'+self.name, Session.get('charge-'+self.name) + 10);
      if (Session.get('charge-'+self.name) >= self.rate) {
        console.log('Ready to fire ' + self.name);
        Session.set('charge-'+self.name, self.rate);
        Meteor.clearInterval(self.weaponTimer);
      }
    }, 10);
  },
  'click .fire': function (e) {
    e.preventDefault();
    var self = this;
    if (Session.get('charge-'+self.name) < self.rate)
      return false;

    console.log('Firing ' + self.name);
    Session.set('charge-'+self.name, 0);
  }
});
