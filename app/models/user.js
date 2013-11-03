module.exports = function(mongoose) {
  var UserSchema = new mongoose.Schema({
  	name: {type: String},
  	role: {type: Number},
  	twitter_id: {type: String},
  	twitter_username: {type: String},
  	twitter_access_token: {type: String},
  	twitter_access_secret: {type: String},
  	active: {type: Number},
  	language: {type: String}
  })

  var UserModel = mongoose.model('User', UserSchema)

  return UserModel
}