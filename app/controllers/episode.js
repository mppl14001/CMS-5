module.exports.getEpisodeById = function(req, res) {

	var episodeNumber = parseInt(req.param('id'), 10)

	if (episodeNumber) {

		Episode.find(episodeNumber).success(function(episode) {

			if (episode) {
				// Return episode
				res.end()
			} else {
				res.send(404, 'Episode not found.')
			}
		})
	}
}

module.exports.getTranscript = function(req, res) {
	Transcription.find({ id: req.params.id }).success(function(result) {
		res.render('admin/transcript', {
			transcript: result
		})
	})
}

module.exports.getTranscription = function(req, res) {
	res.render('admin/transcription', {
		episode: req.params.id
	})
}

module.exports.postTranscription = function(req, res) {
	console.log(req.params.id, req.body.transcription)
	Transcription.create({ text: req.body.transcription, EpisodeId: req.params.id }).success(function(result) {
		res.redirect('/transcript/' + result.id)
	})
}
