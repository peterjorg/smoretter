var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('register', { title: 'Register' });
});

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