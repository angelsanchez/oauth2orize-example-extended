/**
 * Module dependencies.
 */
var passport = require('passport')

exports.info = [
  passport.authenticate('bearer', { session: false }),
  function(req, res) {

  	console.log(" * UserInfo req.authInfo=", req.authInfo)

  	// Check the scope
  	if ( req.authInfo.scope.indexOf("userinfo") == -1 ) {
  		res.send(401);
  	}

    // req.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`.  It is typically used to indicate scope of the token,
    // and used in access control checks.  For illustrative purposes, this
    // example simply returns the scope in the response.
    res.json({ user_id: req.user.id, name: req.user.name, scope: req.authInfo.scope })
  }
]


exports.fullinfo = [
	passport.authenticate('bearer', { session: false }),
	function(req, res) {

		console.log(" * UserProfile req.authInfo=", req.authInfo)

		// Check the scope
  	if ( req.authInfo.scope.indexOf("userfullinfo") == -1 ) {
  		res.send(401);
  	}

    res.json(req.user)
	}
]
