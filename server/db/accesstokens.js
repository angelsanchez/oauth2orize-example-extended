var tokens = {}
	, EXPIRES_IN = 10 // seconds
	, refreshTokens = {}


exports.find = function(key, done) {
  var token = tokens[key];
  if ( !token ) { return done(new Error("Access token not found")); }
  return done(null, token);
};

exports.save = function(token, refreshToken, userID, clientID, scope, done) {
  var expiration = new Date().getTime() + (EXPIRES_IN * 1000);
  tokens[token] = { userID: userID, clientID: clientID, scope: scope, expiration: expiration };
  refreshTokens[refreshToken] = token;
  return done(null);
};

exports.findRefresh = function (refreshToken, done) {
  var rtoken = refreshTokens[refreshToken];
  if ( !rtoken ) { return done(new Error("Refresh token not found")); }
  return done(null, rtoken);
};

exports.delete = function(token, done) {
  delete tokens[token];
	return done(null);
};
