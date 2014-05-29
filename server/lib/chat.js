ChatStream = new Meteor.Stream('chat');

ChatStream.permissions.write(function () {
  return true;
});

ChatStream.permissions.read(function () {
  return true;
});
//
//ChatStream.addFilter(function (eventName, args) {
//  if (this.userId) {
//    var user = Meteor.users.findOne(this.userId);
//    return [args[0], user.username];
//  } else {
//    return args;
//  }
//});
