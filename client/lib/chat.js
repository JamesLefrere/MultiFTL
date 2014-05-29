ChatStream = new Meteor.Stream('chat');
Chat = new Meteor.Collection(null);

ChatStream.on('message', function(data) {
  Chat.insert({
    username: data.username,
    message: data.message,
    game: data.game
  });
});
