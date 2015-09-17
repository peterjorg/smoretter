var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');

var redis = require('redis');
var redisClient = redis.createClient('6379', 'redis');

redisClient.on('connect', function() {
  console.log('Redis connected.');  
});

// ------ mongoose stuff  
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUriString = 'mongodb://mongo:27017';

mongoose.connect(mongooseUriString, function(err, db) {
  if (err) {
    console.log("ERROR connecting to: " + mongooseUriString + ". Error: " + err);
  } else {
    console.log("CONNECTED to: " + mongooseUriString);
  }
});

mongoose.connection.on('open', function (err, user) {
  mongoose.connection.db.collection("UsersCollection", function (err, users) {
    if (err) console.log("collection ERR" + err);
  });
});
// ------ end mongoose stuff 
 
var app = express();

// Set it here, so we can read it from routes files.
app.set('redisClient', redisClient);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);

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
