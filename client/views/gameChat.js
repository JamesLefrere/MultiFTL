Template.gameChat.helpers({
  chatMessages: function () {
    if (typeof this.game !== 'undefined')
      return Chat.find({ game: this.game._id }).fetch();
  }
});

Template.gameChat.events({
  'submit #chat': function (e) {
    e.preventDefault();
    var $chatText = $('#chatText');
    var message = $chatText.val();
    if (message.length) {
      var data = {
        username: 'me',
        message: message,
        game: this.game._id
      };
      Chat.insert(data);
      data.username = Meteor.user().username;
      ChatStream.emit('message', data);
      $chatText.val('').focus();
    }
  }
});