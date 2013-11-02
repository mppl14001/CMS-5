var mongoose = require('mongoose')

var TagSchema = new mongoose.Schema({
	text: {type: String}
})

var TagModel = mongoose.model('Tag', TagSchema)

module.exports = TagModel
