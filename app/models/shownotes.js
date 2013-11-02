var mongoose = require('mongoose')

var ShownotesSchema = new mongoose.Schema({
	content: {type: Buffer},
	language: {type: String}
})

var ShownotesModel = mongoose.model('Shownotes', ShownotesSchema)

module.exports = ShownotesModel
