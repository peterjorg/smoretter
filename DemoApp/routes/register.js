var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017', function(err, db) {
  if (err) {
    console.log("ERROR: " + err);
  }
});

router.get('/', function(req, res, next) {
    res.render('register', { title: 'Register' });
});

var userSchema = new mongoose.Schema({
      name: {
        first: String,
        last: { type: String, trim: true }
      },
      username: { type: String, trim: true },
      email: { type: String, trim: true },
      password: {type: String },
    });
    
var User = mongoose.model('UsersCollection', userSchema);
  

router.post('/', function(req,res,next) {
  
  var user = new User({
    name: { first: req.body.Firstname, last: req.body.Lastname },
    email: req.body.Email,
    username: req.body.Username, 
    password: req.body.Password
  });
  
    // Saving it to the database.
    user.save(function (err) {
      if (err) { 
          console.log ('Error on save!')
        }
        else {
          console.log("all good saving the user!!");  
          
          User.find({},{},function(err,users) {
            console.log(JSON.stringify(users));
            });
        }
        
        res.redirect("users");
     });
     
  // TODO: do validation etc., don't store passwords in plain text ....
  
});

module.exports = router;