module.exports.getEpisodeById = function(req, res) {

	var episodeNumber = parseInt(req.param('id'), 10)

	if (episodeNumber) {

		models.Episode.find(episodeNumber).success(function(episode) {

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
	Transcription.create({
	  text: req.body.transcription,
	  EpisodeId: req.params.id
  }).success(function(result) {
		res.redirect('/transcript/' + result.id)
	})
}

module.exports.getSearch = function(req, res) {
	res.render('search')
}

module.exports.postSearch = function(req, res) {
	console.log(req.body.query)
	models.Episode.search({query: req.body.query}, function(err, results) {
		if (err) res.send(500, {error: 'An unknown error has occured.'})
		console.log('Hits + ' + results.hits.hits, results)
		res.render('search-results', {
			result: results.hits.hits,
			query: req.body.query
		})
	})
}

module.exports.postAPISearch = function(req, res) {
	models.Episode.search({query: req.body.query}, function(err, results) {
		if (err) res.send(500, {error: 'An unknown error has occured.'})
		res.send(results)
	})
}