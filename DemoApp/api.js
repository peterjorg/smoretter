// API controller
var User = require("./models/user.js");

exports.registerUser = function (req, res, next) {
	User.register(new User({
		username: req.body.username}), req.body.password, function (err, u) {
			if (err) {
				return res.render("register", { info: "Sorry :( Username already exists."});
			}
		});
		
	res.render('index', { user: req.user });
}

exports.showUsers = function (req, res, next) { 
	User.find({}, function (err, users){
		if (!err) { 
			res.render('users', { users: users });
		}	
	})
}