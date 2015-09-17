// API controller

var User = require("./models/user.js");

exports.registerUser = function (req, res, next) {
	var user = new User({
		name: { first: req.body.Firstname, last: req.body.Lastname },
		email: req.body.Email,
		username: req.body.Username, 
		password: req.body.Password
		});
		
	user.save();
	res.redirect('/');
}

exports.showUsers = function (req, res, next) { 
	User.find({}, function (err, users){
		if (!err) { 
			res.render('users', { users: users });
		}	
	})
}