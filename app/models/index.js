var Sequelize = require('sequelize')

var fixtures = require(__dirname + '/fixtures.js')

var trackChanges = require(__dirname + '/../misc/changes.js')

var dbConfig = config.get('db')

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')
module.exports['shownotes'] = sequelize.import(__dirname + '/shownotes.js')
module.exports['user'] = sequelize.import(__dirname + '/user.js')
module.exports['tag'] = sequelize.import(__dirname + '/tag.js')
module.exports['transcriptions'] = sequelize.import(__dirname + '/transcription.js')

var forceDatabaseUpgrade = false

async.parallel([
	function(callback) {
		module.exports['episode'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			if (forceDatabaseUpgrade) trackChanges('Episodes')
		})
	}, function(callback) {
		module.exports['shownotes'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			if (forceDatabaseUpgrade) trackChanges('Shownotes')
		})
	}, function(callback) {
		module.exports['user'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			if (forceDatabaseUpgrade) trackChanges('Users')
		})
	}, function(callback) {
		module.exports['tag'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			if (forceDatabaseUpgrade) trackChanges('Tags')
		})
	}, function(callback) {
		module.exports['transcriptions'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			if (forceDatabaseUpgrade) trackChanges('Transcriptions')
		})
	}
], function() {
	if (forceDatabaseUpgrade) {
		fixtures()
	}
})

module.exports['episode'].hasMany(module.exports['shownotes'], {as: 'shownotes'})
module.exports['user'].hasMany(module.exports['episode'], {as: 'episodes'})
module.exports['episode'].belongsTo(module.exports['user'], {as: 'author'})
module.exports['episode'].hasMany(module.exports['tag'], {as: 'tags'})
module.exports['tag'].hasMany(module.exports['episode'], {as: 'episode'})
module.exports['transcriptions'].belongsTo(module.exports['episode'], {as: 'episode'})
module.exports['episode'].hasMany(module.exports['transcriptions'], {as: "transcripts"})

function seedData() {
	User.create({
		name: 'Random Tester',
		role: 1,
		twitter_id: '12345678',
		twitter_username: 'RandoTester11',
		twitter_access_token: '<redacted>',
		twitter_access_secret: '<redacted>',
		active: 1
	}).success(function(user) {
		console.log('Seeded user: ' + user.name)
	}).failure(function(error) {
		console.log('Failed to seed user with error: ' + error)
	})

	User.create({
		name: 'Lester Tester',
		role: 2,
		twitter_id: '876432',
		twitter_username: 'LesterTheTester00',
		twitter_access_token: '<redacted>',
		twitter_access_secret: '<redacted>',
		active: 1
	}).success(function(user) {
		console.log('Seeded user: ' + user.name)
	}).failure(function(error) {
		console.log('Failed to seed user with error: ' + error)
	})

	User.create({
		name: 'CodePilot ROX',
		role: 3,
		twitter_id: '97656454',
		twitter_username: 'CODEPILOTROX987',
		twitter_access_token: '<redacted>',
		twitter_access_secret: '<redacted>',
		active: 0
	}).success(function(user) {
		console.log('Seeded user: ' + user.name)
	}).failure(function(error) {
		console.log('Failed to seed user with error: ' + error)
	})

	User.create({
		name: 'T E S T',
		role: 4,
		twitter_id: '834579384',
		twitter_username: 'TESTING14',
		twitter_access_token: '<redacted>',
		twitter_access_secret: '<redacted>',
		active: 0
	}).success(function(user) {
		console.log('Seeded user: ' + user.name)
	}).failure(function(error) {
		console.log('Failed to seed user with error: ' + error)
	})

	var transcriptions = []
	async.series([
		function(callback) {
			Transcription.create({
				approved: true,
				text: 'I code stuff.',
				language: 'en'
			}).success(function(transcription) {
				transcriptions.push(transcription)
				callback(null, transcription)
			}).failure(function(error) {
				console.log('Failed to seed transcription with error: ' + error)
				callback(error, null)
			})
		}, function(callback) {
			Transcription.create({
				approved: false,
				text: 'I code more stuff.',
				language: 'es'
			}).success(function(transcription) {
				transcriptions.push(transcription)
				callback(null, transcription)
			}).failure(function(error) {
				console.log('Failed to seed transcription with error: ' + error)
				callback(error, null)
			})
		}, function(callback) {
			Episode.create({
				title: 'Screencast #1: How to Setup Your Development Environment',
				ytURL: 'http://www.youtube.com/watch?v=xRopHl9ouvY',
				published: true,
				approved: true
			}).success(function(episode) {
				console.log('Seeded episode: ' + episode.title)
				episode.setTranscripts(transcriptions).success(function() {
					callback(null, null)
				}).failure(function(error) {
					console.log('Failed to set relationship between transcripts and episode.')
					callback(error, null)
				})
			}).failure(function(error) {
				console.log('Failed to seed episode with error: ' + error)
				callback(error, null)
			})
		}
	])

	Episode.create({
		title: 'Screencast #2: Customizing Sublime Text',
		ytURL: 'http://www.youtube.com/watch?v=ic8XU6VffeU',
		published: false,
		approved: true
	}).success(function(episode) {
		console.log('Seeded episode: ' + episode.title)
	}).failure(function(error) {
		console.log('Failed to seed episode with error: ' + error)
	})

	Episode.create({
		title: 'Codepilot #3: Terminal Basics',
		ytURL: 'http://www.youtube.com/watch?v=5cLww0geD2o',
		published: false,
		approved: false
	}).success(function(episode) {
		console.log('Seeded episode: ' + episode.title)
	}).failure(function(error) {
		console.log('Failed to seed episode with error: ' + error)
	})
}

module.exports.sequelize = sequelize
