Template.controls.helpers({
  viewModeMicro: function () {
    return Session.get('viewMode');
  },
  viewModeMacro: function () {
    return !Session.get('viewMode');
  }
});

Template.controls.events({
  'click .control': function (e) {
    e.preventDefault();
    var $this = $(e.currentTarget);
    switch ($this.data('action')) {
      case 'toggleView':
        Session.toggle('viewMode');
        break;
    }
  }
});