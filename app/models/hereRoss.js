var mongoose = require('mongoose')

var db = mongoose.connection

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

db.on('error', console.error)
db.once('open', function() {

	var Episode = require('./episode.js')

	var episode = new Episode({
		title: 'ABC',
		ytURL: 'YOLO',
		published: false,
		approved: false
	})

	episode.save(function (err) {
		console.log(err)
	})

})

mongoose.connect('mongodb://localhost/codepilot-dev')