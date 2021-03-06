var fs = require('fs')
var async = require('async')

function createUser(data, callback) {
	models.User.create({
		name: data.name,
		role: data.role,
		twitter_id: data.twitter_id,
		twitter_username: data.twitter_username,
		twitter_access_token: data.twitter_access_token,
		twitter_access_secret: data.twitter_access_secret,
		active: data.active
	}, callback)
}

function createEpisode(episode, episodeCallback) {
	models.Episode.create({
		title: episode.title,
		ytURL: episode.ytURL,
		published: episode.published,
		approved: episode.approved,
		tags: episode.tags,
		shownotes: episode.shownotes,
		transcriptions: episode.transcriptions
	}, episodeCallback)
}

function generateFixtures() {
	var fixturesFile = __dirname + '/fixtures.json'
	if (!fs.existsSync(fixturesFile)) {
		console.log('Fixtures file not found.')
		return;
	}
	var fixtures = JSON.parse(fs.readFileSync(fixturesFile, 'utf8'))
	async.each(fixtures.users, function(user, userCallback) {
		var episodes = []
		createUser(user, function(error, createdUser) {
			async.each(user.episodes, function(episode, episodeCallback) {
				createEpisode(episode, function(error, episode) {
					if (!error) {
						episode.creator = createdUser._id
						episode.save(function(error, newEpisode) {
							episodeCallback(error, newEpisode)
						})
					} else {
						episodeCallback(error, null)
					}
				})
			}, function(err) {
				if (err) {
					console.log('An error occurred while generating seed data')
				}
			})
		})
	})
}

module.exports = generateFixtures