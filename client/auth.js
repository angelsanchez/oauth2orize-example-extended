/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError


/**
 * `Strategy` constructor.
 *
 * The AppExample authentication strategy authenticates requests by delegating to
 * AppExample using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your AppExample application's client id
 *   - `clientSecret`  your AppExample application's client secret
 *   - `callbackURL`   URL to which AppExample will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new AppExampleStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/appexample/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'http://localhost:3000/dialog/authorize';
  options.tokenURL = options.tokenURL || 'http://localhost:3000/oauth/token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'appexample';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from AppExample.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `appexample`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.getProtectedResource('http://localhost:3000/api/userinfo', accessToken, function (err, body, res) {

    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try { 
      var json = JSON.parse(body);

      console.log(" * userProfile body[" + body + "]")
      
      var profile = { provider: 'appexample' };
      profile.id = json.user_id;
      profile.name = json.name;
      
      //profile._raw = body;
      //profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
exports.Strategy = Strategy;
