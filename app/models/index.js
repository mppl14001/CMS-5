var Sequelize = require('sequelize')

var dbConfig = config.get('db')

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')
module.exports['shownotes'] = sequelize.import(__dirname + '/shownotes.js')
module.exports['user'] = sequelize.import(__dirname + '/user.js')
module.exports['tag'] = sequelize.import(__dirname + '/tag.js')

var forceDatabaseUpgrade = false;

module.exports['episode'].sync({force: forceDatabaseUpgrade})
module.exports['shownotes'].sync({force: forceDatabaseUpgrade})
module.exports['user'].sync({force: forceDatabaseUpgrade})
module.exports['tag'].sync({force: forceDatabaseUpgrade})

module.exports['episode'].hasMany(module.exports['shownotes'], {as: 'shownotes_translations'})
module.exports['user'].hasMany(module.exports['episode'], {as: 'episodes'})
module.exports['episode'].hasOne(module.exports['user'], {as: 'author'})
module.exports['episode'].hasMany(module.exports['tag'], {as: 'tags'})
module.exports['tag'].hasMany(module.exports['episode'], {as: 'episdoes'})

module.exports.sequelize = sequelize