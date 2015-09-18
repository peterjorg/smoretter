var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session');
var methodOverride = require('method-override')

var db = require('./mongoDb.js');
var redisClient = require('./redis.js');
var packagejson = require('./package.json');

// Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Routes
var routes = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');

// API 
var api = require('./api.js');
routes.post('/register', api.registerUser);
routes.get('/users', api.showUsers);
 
var app = express();

// Set it here, so we can read it from routes files.
app.set('redisClient', redisClient);
app.set('appVersion', packagejson.version);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  secret: 'secret thing',
  saveUninitialized: false, 
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/login', login);
app.use('/register', register);

// Passport configuration
var User = require('./models/user.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

routes.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {  
   // if any problems exist, error out
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(500, info.message);
            }

            // log in the user
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                // once login succeeded, return the user and session created 201
                return res.redirect('/'); //, { user : user} );
            });
  })(req, res,next); 
});

routes.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
