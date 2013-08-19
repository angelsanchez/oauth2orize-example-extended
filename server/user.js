/**
 * Module dependencies.
 */
var passport = require('passport')

exports.info = [
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    // req.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`.  It is typically used to indicate scope of the token,
    // and used in access control checks.  For illustrative purposes, this
    // example simply returns the scope in the response.
    res.json({ user_id: req.user.id, name: req.user.name, scope: req.authInfo.scope })
  }
]


exports.personaldata = [
	passport.authenticate('bearer', { session: false }),
  ensureScope("personaldata"),
	function(req, res) {
    res.json(req.user)
	}
]


function ensureScope (scope) {
  return function (req, res, next) {
    console.log("ensureScope[" + scope + "], req.authInfo=", req.authInfo)

    if ( !req.authInfo || !req.authInfo.scope || req.authInfo.scope.indexOf(scope) == -1 ) {
      res.send(403);
    } else {
      next();
    }
  };
}
