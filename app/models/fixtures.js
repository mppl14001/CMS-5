var fs = require('fs')

function createUser(data, callback) {
	User.create({
		name: data.name,
		role: data.role,
		twitter_id: data.twitter_id,
		twitter_username: data.twitter_username,
		twitter_access_token: data.twitter_access_token,
		twitter_access_secret: data.twitter_access_secret,
		active: data.active
	}).success(function(user) {
		callback(null, user)
	}).failure(function(error) {
		callback(error, null)
	})
}

function createEpisode(episode, episodeCallback) {
	var allShownotes = []
	var allTranscriptions = []
	var allTags = []

	var episode;

	async.parallel([
		function(shownotesCallback) {
			async.each(episode.shownotes, function(shownotes, iteratorCallback) {
				Shownotes.create({
					content: shownotes.content,
					language: shownotes.language
				}).success(function(savedShownotes) {
					allShownotes.push(savedShownotes)
					iteratorCallback(null, savedShownotes)
				}).failure(function(error) {
					iteratorCallback(error, null)
				})
			}, function(err) {
				shownotesCallback(err, null)
			})
		}, function(transcriptionCallback) {
			async.each(episode.transcriptions, function(transcription, iteratorCallback) {
				Transcription.create({
					approved: transcription.approved,
					text: transcription.text,
					language: transcription.language
				}).success(function(savedTranscription) {
					allTranscriptions.push(savedTranscription)
					iteratorCallback(null, savedTranscription)
				}).failure(function(error) {
					iteratorCallback(error, null)
				})
			}, function(err) {
				transcriptionCallback(err, null)
			})
		}, function(tagCallback) {
			async.each(episode.tags, function(tag, iteratorCallback) {
				Tag.create({
					text: tag.text
				}).success(function(savedTag) {
					allTags.push(savedTag)
					iteratorCallback(null, savedTag)
				}).failure(function(error) {
					iteratorCallback(error, null)
				})
			}, function(err) {
				tagCallback(err, null)
			})
		}], function(error, responses) {
			if (error) {
				episodeCallback(error, null)
			} else {
				async.series([
					function(callback) {
						Episode.create({
							title: episode.title,
							ytURL: episode.ytURL,
							published: episode.published,
							approved: episode.approved
						}).success(function(createdEpisode) {
							episode = createdEpisode
							callback(null, createdEpisode)
						}).failure(function(error) {
							callback(error, null)
						})
					}, function(callback) {
						episode.setShownotes(allShownotes).success(function() {
							callback(null, null)
						}).failure(function(error) {
							callback(error, null)
						})
					}, function(callback) {
						episode.setTranscripts(allTranscriptions).success(function() {
							callback(null, null)
						}).failure(function(error) {
							callback(error, null)
						})
					}, function(callback) {
						episode.setTags(allTags).success(function() {
							callback(null, null)
						}).failure(function(error) {
							callback(error, null)
						})
					}
				], function(error, responses) {
					episodeCallback(error, responses[0])
				})
			}
		}
	)
}

function generateFixtures() {
	try {
		var fixtures = JSON.parse(fs.readFileSync(__dirname + '/fixtures.json', 'utf8'))
		async.each(fixtures.users, function(user, userCallback) {
			var episodes = []
			createUser(user, function(error, createdUser) {
				async.each(user.episodes, function(episode, episodeCallback) {
					createEpisode(episode, function(error, episode) {
						if (!error) {
							episodes.push(episode)
						}
						episodeCallback(error)
					})
				}, function(err) {
					createdUser.setEpisodes(episodes).success(function() {
						userCallback(null)
					}).failure(function(error) {
						userCallback(err)
					})
				})
			})
		})
	} catch (err) {
		console.log('Did not seed data: ' + err)
	}
}

module.exports = generateFixtures