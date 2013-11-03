var mongoose = require('mongoose')

var TranscriptionSchema = new mongoose.Schema({
	id: {
		type: Number,
		index: true
	},
	approved: {type: Boolean},
	text: {type: String},
	language: {type: String}
})

module.exports = mongoose.model('Transcription', TranscriptionSchema)