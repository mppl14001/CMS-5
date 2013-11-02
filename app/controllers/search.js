function filterByTags(episodes, tags, callback) {
	if (tags.length === 0) {
		callback(null, episodes)
		return
	}
	var filtered = []
	async.each(episodes, function(episode, done) {
		episode.getTags().success(function(episodeTags) {
			for (var i = 0; i < episodeTags.length; i++) {
				console.log(tags.indexOf(episodeTags[i].text))
				if (tags.indexOf(episodeTags[i].text) !== -1) {
					filtered.push(episode)
					done(null)
					return
				}
			}
			done(null)
			return
		}).failure(function(error) {
			done(error)
		})
	}, function(error) {
		if (error) {
			callback(error, null)
		} else {
			callback(null, filtered)
		}
	})
}

module.exports.getSearch = function(req, res) {
	var queries = req.query.queryString.split(' ')
	var queryString = ''
	for (var i = 0; i < queries.length; i++) {
		queryString += '\'' + queries[i] + '\''
		if (i !== queries.length - 1) queryString += ','
	}
	var filters
	if (req.query.tags) {
		filters = req.query.tags.split(',')
	} else {
		filters = []
	}
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
		} else {
			//make it unique
			var unique = _.uniq(matches, function(match) {return match.id})
			filterByTags(unique, filters, function(error, filtered) {
				if (error) {
					res.send(JSON.stringify(error))
				} else {
					res.send(JSON.stringify(filtered))
				}

			})
		}
	})
}