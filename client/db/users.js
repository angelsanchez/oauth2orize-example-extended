var users = {};

exports.find = function(id, done) {
  return done(null, users[id]);
};

exports.updateOrCreate = function (profile, accessToken, refreshToken, done) {
  var user = users[profile.id];
  if ( !user ) {
    user = {
      id : profile.id,
      name : profile.name
    };
    users[profile.id] = user;
  }
  
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  done(null, user);
};
