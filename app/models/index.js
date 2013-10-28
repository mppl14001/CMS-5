var Sequelize = require('sequelize')

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
			trackChanges('Episodes')
		})
	}, function(callback) {
		module.exports['shownotes'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			trackChanges('Shownotes')
		})	
	}, function(callback) {
		module.exports['user'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			trackChanges('Users')
		})
	}, function(callback) {
		module.exports['tag'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			trackChanges('Tags')
		})
	}, function(callback) {
		module.exports['transcriptions'].sync({force: forceDatabaseUpgrade}).success(function(results) {
			callback(null, null)
			trackChanges('Transcriptions')
		})
	}
], function() {
	if (forceDatabaseUpgrade) {
		seedData()
	}
})

module.exports['episode'].hasMany(module.exports['shownotes'], {as: 'shownotes_translations'})
module.exports['user'].hasMany(module.exports['episode'], {as: 'episodes'})
module.exports['episode'].belongsTo(module.exports['user'], {as: 'author'})
module.exports['episode'].hasMany(module.exports['tag'], {as: 'tags'})
module.exports['tag'].hasMany(module.exports['episode'], {as: 'episode'})
module.exports['transcriptions'].belongsTo(module.exports['episode'], {as: 'episode'})
module.exports['episode'].hasMany(module.exports['transcriptions'], {as: "transcripts"})

//prepare to enter into the depths of SQL hell...
function trackChanges(table) {
	var historyTable = table + '_history'
	if (forceDatabaseUpgrade) {
		async.series([
			function(callback) {
				executeQuery('DROP TABLE IF EXISTS ' + historyTable, callback)
			}, function(callback) {
				executeQuery('CREATE TABLE ' + historyTable + ' LIKE ' + table, callback)
			}, function(callback) {
				executeQuery('ALTER TABLE ' + historyTable + ' MODIFY COLUMN id int(11) \
NOT NULL, DROP PRIMARY KEY, ENGINE = MyISAM, \
ADD action VARCHAR(8) DEFAULT \'insert\' FIRST, \
ADD revision INT(6) NOT NULL AUTO_INCREMENT AFTER action, \
ADD dt_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER revision, \
ADD PRIMARY KEY (id, revision)', callback)
			}, function(callback) {
				executeQuery('DROP TRIGGER IF EXISTS ' + table + '__ai', callback)
			}, function(callback) {
				executeQuery('DROP TRIGGER IF EXISTS ' + table + '__au', callback)
			}, function(callback) {
				executeQuery('DROP TRIGGER IF EXISTS ' + table + '__bd', callback)
			}, function(callback) {
				executeQuery('CREATE TRIGGER ' + table + '__ai AFTER INSERT ON ' + table + ' FOR EACH ROW \
INSERT INTO ' + historyTable + ' SELECT \'insert\', NULL, NOW(), d.* \
FROM ' + table + ' AS d WHERE d.id = NEW.id', callback)
			}, function(callback) {
				executeQuery('CREATE TRIGGER ' + table + '__au AFTER UPDATE ON ' + table + ' FOR EACH ROW \
INSERT INTO ' + historyTable + ' SELECT \'update\', NULL, NOW(), d.* \
FROM ' + table + ' AS d WHERE d.id = NEW.id', callback)
			}, function(callback) {
				executeQuery('CREATE TRIGGER ' + table + '__bd BEFORE DELETE ON ' + table + ' FOR EACH ROW \
INSERT INTO ' + historyTable + ' SELECT \'delete\', NULL, NOW(), d.* \
FROM ' + table + ' AS d WHERE d.id = OLD.id', callback)
			}
		], function(error, results) {
			if (error) {
				console.log('Error occurred while attempting to set up change tracking: ' + error)
			}
		})
	}
}

function executeQuery(query, callback) {
	sequelize.query(query).success(function(result) {
		callback(null, result)
	}).failure(function(error) {
		callback(error, null)
	})
}

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
