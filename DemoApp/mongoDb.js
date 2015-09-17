var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUriString = 'mongodb://mongo:27017';

mongoose.connect(mongooseUriString, function(err, db) {
  if (err) {
    console.log("ERROR connecting to: " + mongooseUriString + ". Error: " + err);
    next(new Error("ERROR connecting to: " + mongooseUriString + ". Error: " + err));
  } else {
    console.log("CONNECTED to: " + mongooseUriString);
  }
});

mongoose.connection.on('open', function (err, user) {
  mongoose.connection.db.collection("UsersCollection", function (err, users) {
    if (err) console.log("collection ERR" + err);
  });
});