var mongoose = require('mongoose')

var TranscriptionSchema = new mongoose.Schema({
	approved: {type: Boolean},
	text: {type: String},
	language: {type: String}
})

var TranscriptionModel = mongoose.model('Transcription', TranscriptionSchema)

module.exports = TranscriptionModel
