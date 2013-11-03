var mongoose = require('mongoose')

var ShownotesSchema = new mongoose.Schema({
	content: {
		type: Buffer,
		get: function(a){ return a.toString('utf-8') }
	},
	language: {type: String}
})

var ShownotesModel = mongoose.model('Shownotes', ShownotesSchema)

module.exports = ShownotesModel
