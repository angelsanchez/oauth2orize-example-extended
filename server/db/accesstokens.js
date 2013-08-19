var tokens = {}
	, EXPIRES_IN = 10 // seconds


exports.find = function(key, done) {
  var token = tokens[key];
  return done(null, token);
};

exports.save = function(token, userID, clientID, scope, done) {
  var expiration = new Date().getTime() + (EXPIRES_IN * 1000);
  tokens[token] = { userID: userID, clientID: clientID, scope: scope, expiration: expiration };
  return done(null);
};

exports.delete = function(token, done) {
  delete tokens[token];
	return done(null);
};
