var mongoose = require('mongoose')

var EpisodeSchema = new mongoose.Schema({
	id: {type: [Number], index: true},
	title: {type: String},
	ytURL: {type: String},
	published: {type: Boolean},
	approved: {type: Boolean},
	tags: [{
		text: String
	}],
	shownotes: [{
		text: Buffer,
		language: String
	}],
	transcriptions: [{
		approved: Boolean,
		text: Buffer,
		language: String
	}],
	creator: {type: mongoose.Schema.Types.ObjectId}
})

var EpisodeModel = mongoose.model('Episode', EpisodeSchema)

module.exports = EpisodeModel
