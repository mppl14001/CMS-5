module.exports.getSearch = function(req, res) {
	var queries = req.query.queryString.split(' ')
	var queryString = ''
	for (var i = 0; i < queries.length; i++) {
		queryString += '\'' + queries[i] + '\''
		if (i !== queries.length - 1) queryString += ','
	}
	var filters = req.query.tags.split(',')
	
	var matches = []
	async.parallel([
		function(callback) {
			sequelize.query('SELECT * FROM Episodes WHERE MATCH (title) AGAINST ( :queryString );',  null, {raw: true}, {queryString: queryString}).success(function(results) {
				for (var i = 0; i < results.length; i++) {
					matches.push(Episode.build(results[i]))
				}
				callback(null, null)
			}).failure(function(error) {
				callback(error, null)
			})
		}, function(callback) {
			sequelize.query('SELECT * FROM Shownotes WHERE MATCH (content) AGAINST ( :queryString );',  null, {raw: true}, {queryString: queryString}).success(function(results) {
				async.each(results, function(item, done) {
					var shownotes = Shownotes.build(item)
					shownotes.getEpisode().success(function(episode) {
						matches.push(episode)
						done(null)
					}).failure(function(error) {
						done(error)
					})
				}, function(error) {
					callback(error, null)
				})
			}).failure(function(error) {
				callback(error, null)
			})
		}, function(callback) {
			sequelize.query('SELECT * FROM Transcriptions WHERE MATCH (text) AGAINST ( :queryString );',  null, {raw: true}, {queryString: queryString}).success(function(results) {
				async.each(results, function(item, done) {
					var transcription = Transcription.build(item)

					transcription.getEpisode().success(function(episode) {
						matches.push(episode)
						done(null)
					}).failure(function(error) {
						done(error)
					})
				}, function(error) {
					callback(error, null)
				})
			}).failure(function(error) {
				callback(error, null)
			})
		}
	], function(error, responses) {
		if (error) {
			res.send(JSON.stringify(error))
			return
		}
		var filteredMatches = []
		var tags = []
		async.each(filters, function(filter, done) {
			Tag.find({text: filter}).success(function(tag) {
				filteredMatches.push(tag)
				done(null)
			}).failure(function(error) {
				done(error)
			})
		}, function(error) {
			if (error) {

			}
			res.send(JSON.stringify(matches))
		})
	})
}