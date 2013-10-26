var Sequelize = require('sequelize')

var dbConfig = config.get('db')

var sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password)

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')
module.exports['shownotes'] = sequelize.import(__dirname + '/shownotes.js')
module.exports['user'] = sequelize.import(__dirname + '/user.js')

module.exports['episode'].sync()
module.exports['shownotes'].sync()
module.exports['user'].sync()

module.exports['episode'].hasMany(module.exports['shownotes'], {as: 'shownotes_translations'})
module.exports['user'].hasMany(module.exports['episode'], {as: 'episodes'})
module.exports['episode'].hasOne(module.exports['user'], {as: 'author'})

module.exports.sequelize = sequelize