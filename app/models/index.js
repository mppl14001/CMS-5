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
	async.series([
		function(bigCallback) {
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
						callback(null, null)
						bigCallback(null, null)
					}
				])
			}
		}, function(bigCallback) {
			async.series([
				function(callback) {
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
				}, function(callback) {
					callback(null, null)
					bigCallback(null, null)
				}
			])
		}
	], function(error, results) {
		console.log(error)
	})
}

function executeQuery(query, callback) {
	sequelize.query(query).success(function(result) {
		callback(null, result)
	}).failure(function(error) {
		console.log('An error occurred while executing the query: ' + query)
		console.log('Error: ' + error)
		callback(error, null)
	})
}

module.exports.sequelize = sequelize