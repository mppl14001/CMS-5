var Sequelize = require('sequelize')

var dbConfig = config.get('db')

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')
module.exports['shownotes'] = sequelize.import(__dirname + '/shownotes.js')
module.exports['user'] = sequelize.import(__dirname + '/user.js')
module.exports['tag'] = sequelize.import(__dirname + '/tag.js')
module.exports['transcriptions'] = sequelize.import(__dirname + '/transcription.js')

var forceDatabaseUpgrade = false

module.exports['episode'].sync({force: forceDatabaseUpgrade}).success(function(results) {
	trackChanges('Episodes')
})
module.exports['shownotes'].sync({force: forceDatabaseUpgrade}).success(function(results) {
	trackChanges('Shownotes')
})
module.exports['user'].sync({force: forceDatabaseUpgrade}).success(function(results) {
	trackChanges('Users')
})
module.exports['tag'].sync({force: forceDatabaseUpgrade}).success(function(results) {
	trackChanges('Tags')
})
module.exports['transcriptions'].sync({force: forceDatabaseUpgrade}).success(function(results) {
	trackChanges('Transcriptions')
})

module.exports['episode'].hasMany(module.exports['shownotes'], {as: 'shownotes_translations'})
module.exports['user'].hasMany(module.exports['episode'], {as: 'episodes'})
module.exports['episode'].hasOne(module.exports['user'], {as: 'author'})
module.exports['episode'].hasMany(module.exports['tag'], {as: 'tags'})
module.exports['tag'].hasMany(module.exports['episode'], {as: 'episode'})
module.exports['transcriptions'].hasOne(module.exports['episode'], {as: 'episode'})
module.exports['episode'].hasOne(module.exports['transcriptions'], {as: "transcript"})

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
		seedData();
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
		name: 'Will Smidlein',
		role: 1,
		twitter_id: '18194756',
		twitter_username: 'ws',
		twitter_access_token: '<redacted>',
		twitter_access_secret: '<redacted>',
		active: 1
	}).success(function(user) {
		console.log('Seeded user: ' + user.name)
	}).failure(function(error) {
		console.log('Failed to seed user with error: ' + error)
	})

	User.create({
		name: 'Lenny Khazan',
		role: 2,
		twitter_id: '114487028',
		twitter_username: 'LennyKhazan',
		twitter_access_token: '<redacted>',
		twitter_access_secret: '<redacted>',
		active: 1
	}).success(function(user) {
		console.log('Seeded user: ' + user.name)
	}).failure(function(error) {
		console.log('Failed to seed user with error: ' + error)
	})

	User.create({
		name: 'Joe Torraca',
		role: 3,
		twitter_id: '333665491',
		twitter_username: 'jtorraca',
		twitter_access_token: '<redacted>',
		twitter_access_secret: '<redacted>',
		active: 0
	}).success(function(user) {
		console.log('Seeded user: ' + user.name)
	}).failure(function(error) {
		console.log('Failed to seed user with error: ' + error)
	})

	User.create({
		name: 'Ross Penman',
		role: 4,
		twitter_id: '485076559',
		twitter_username: 'PenmanRoss',
		twitter_access_token: '<redacted>',
		twitter_access_secret: '<redacted>',
		active: 0
	}).success(function(user) {
		console.log('Seeded user: ' + user.name)
	}).failure(function(error) {
		console.log('Failed to seed user with error: ' + error)
	})

	var episodeIds = []
	Episode.create({
		title: 'Screencast #1: How to Setup Your Development Environment',
		ytURL: 'http://www.youtube.com/watch?v=xRopHl9ouvY',
		published: true,
		approved: true
	}).success(function(episode) {
		console.log('Seeded episode: ' + episode.title)
		episodeIds.push(episode.id)
	}).failure(function(error) {
		console.log('Failed to seed episode with error: ' + error)
	})

	Episode.create({
		title: 'Screencast #2: Customizing Sublime Text',
		ytURL: 'http://www.youtube.com/watch?v=ic8XU6VffeU',
		published: false,
		approved: true
	}).success(function(episode) {
		console.log('Seeded episode: ' + episode.title)
		episodeIds.push(episode.id)
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
		episodeIds.push(episode.id)
	}).failure(function(error) {
		console.log('Failed to seed episode with error: ' + error)
	})

}

module.exports.sequelize = sequelize