var mongoose = require('mongoose')

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
		approved: Boolean,
		text: String,
		language: String
	}],
	creator: {type: mongoose.Schema.Types.ObjectId}
})

module.exports = mongoose.model('Episode', EpisodeSchema)
