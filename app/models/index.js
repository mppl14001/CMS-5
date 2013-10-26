var Sequelize = require('sequelize')

var dbConfig = config.get('db')

var sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password)

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')
module.exports['shownotes'] = sequelize.import(__dirname + '/shownotes.js')

module.exports['episode'].sync()
module.exports['shownotes'].sync()

module.exports['episode'].hasMany(module.exports['shownotes'], {as: 'shownotes_translations'})

module.exports.sequelize = sequelize