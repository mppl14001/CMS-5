var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
	id: {
		type: Number,
		index: true
	},
	name: {type: String},
	role: {type: Number},
	twitter_id: {type: String},
	twitter_username: {type: String},
	twitter_access_token: {type: String},
	twitter_access_secret: {type: String},
	active: {type: Number},
	language: {type: String}
})

module.exports = mongoose.model('User', UserSchema)