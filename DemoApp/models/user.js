var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var userSchema = new Schema({
      name: {
        first: String,
        last: { type: String, trim: true }
      },
      username: { type: String, trim: true },
      email: { type: String, trim: true },
      password: {type: String },
      created_at: Date,
      updated_at: Date
    });
    
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
    
var User = mongoose.model('User', userSchema);

module.exports = User;