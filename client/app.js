var express = require('express')
  , passport = require('passport')
  , AppStrategy = require('./auth').Strategy
  , utils = require('./utils')
  , partials = require('express-partials')
  , http = require('http')
  , querystring = require('querystring')
  , fs = require('fs')
  , users = require('./db/users.js')


var CLIENT_ID = "abc123";
var CLIENT_SECRET = "ssh-secret";
var CALLBACK_URL = "http://localhost:8080/auth/appexample/callback";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete appexample profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.id); // id stored in a delicious cookie
});

passport.deserializeUser(function(id, done) {
  users.find(id, function (err, user) {
    done(null, user); // Now req.user == user
  })
});


// Use the AppStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and appexample
//   profile), and invoke a callback with a user object.
passport.use(new AppStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {

    console.log("Auth Completed :) | accessToken[" + accessToken + "] refreshToken[" + refreshToken + "] profile[", profile, "]")

    // asynchronous verification, for effect...
    // http://howtonode.org/understanding-process-next-tick
    process.nextTick(function () {

      users.updateOrCreate(profile, accessToken, refreshToken, function(err, user) {
        if(err) { throw err; }
        done(null, user);
      });

    });    
  }
));




var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/appexample
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in appexample authentication will involve
//   redirecting the user to appexample.com.  After authorization, appexample
//   will redirect the user back to this application at /auth/appexample/callback
app.get('/auth/appexample',
  passport.authenticate('appexample', { scope: 'personaldata' }),
  function(req, res){
    console.log("Authorizating...")
  });

// GET /auth/appexample/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/appexample/callback', 
  passport.authenticate('appexample', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

app.get('/userinfo', ensureAuthenticated, function (req, res) {
  res.json(req.user)
});


app.get('/personaldata', ensureAuthenticated, function (req, res) {
  utils.getProtectedResource('/api/user/personaldata', req.user.accessToken, function (err, data) {
    if (err) { return new Error('failed to fetch user full info: ' + err.message); }
    res.send(data);
  })
});


//
// Refresh token
//
app.get('/refresh_token', ensureAuthenticated, function (req, res) {
  var post_data = querystring.stringify({
    client_id : CLIENT_ID,
    client_secret : CLIENT_SECRET,
    grant_type : 'refresh_token',
    refresh_token : req.user.refreshToken
  });

  var options = {
    host: 'localhost',
    path: '/oauth/token',
    port: '3000',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };

  var post_req = http.request(options, function (response) {
    var str = '';

    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      
      var data = JSON.parse(str);
      req.user.accessToken = data.access_token;
      req.user.refreshToken = data.refresh_token;

      res.send(str);
    });
  })

  // post the data
  post_req.write(post_data);
  post_req.end();
});

app.listen(8080);
console.log("http://localhost:8080");
