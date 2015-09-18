var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var passportLocalMongoose = require('passport-local-mongoose');   

var userSchema = new Schema({
      name: {
        first: String,
        last: { type: String, trim: true }
      },
      username : {type: String, trim: true },
      email: { type: String, trim: true },
      created_at: Date,
      updated_at: Date
    });
    
userSchema.plugin(passportLocalMongoose);
    
// When save is called we want to update 
// the updated_at and created_at values.
userSchema.pre('save', function(next) {
      var currentDate = new Date();
      this.updated_at = currentDate;
      
      if (!this.created_at) { 
            this.created_at = currentDate;
      }
      
      next();
});

userSchema.method.authenticate = function(username, password, done) {
    // find the user based off the username (case insensitive)
    userSchema.findOne({
        username: new RegExp(username, "i")
    }).select("+password").exec(function(err, user) {
        // if any problems, error out
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: "Unknown user: " + username
            });
        }

        // verify if the password is valid
        user.isPasswordValid(password, function(err, isValid) {
            // if any problems, error out
            if (err) {
                return done(err);
            }

            // only return the user if the password is valid
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: "Invalid password"
                });
            }
        });
    });
};

module.exports = mongoose.model('User', userSchema);