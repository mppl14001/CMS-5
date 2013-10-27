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

