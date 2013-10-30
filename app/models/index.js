var Sequelize = require('sequelize')

var fixtures = require(__dirname + '/fixtures.js')

var trackChanges = require(__dirname + '/../misc/changes.js')

var dbConfig = config.get('db')

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')
module.exports['shownotes'] = sequelize.import(__dirname + '/shownotes.js')
module.exports['user'] = sequelize.import(__dirname + '/user.js')
module.exports['tag'] = sequelize.import(__dirname + '/tag.js')
module.exports['transcriptions'] = sequelize.import(__dirname + '/transcription.js')

var forceDatabaseUpgrade = config.get('force-upgrade')
var seedData = config.get('seed-data')

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
	if (seedData) {
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

module.exports.sequelize = sequelize
