var mongoose = require('mongoose')
var mongoosastic = require('mongoosastic')

var EpisodeSchema = new mongoose.Schema({
	id: {
		type: Number,
		index: true
	},
	title: {type: String},
	ytURL: {type: String},
	published: {type: Boolean},
	approved: {type: Boolean},
	tags: [{
		text: String
	}],
	shownotes: [{
		text: String,
		language: String
	}],
	transcriptions: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'Transcription'
	}],
	creator: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	}
})

module.exports = EpisodeSchema