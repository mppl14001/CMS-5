var mongoose = require('mongoose')

var EpisodeSchema = new mongoose.Schema({
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
	}]
})

var EpisodeModel = mongoose.model('Episode', EpisodeSchema)

module.exports.Episode = EpisodeModel