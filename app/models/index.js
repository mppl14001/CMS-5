var Sequelize = require('sequelize')

var sequelize = new Sequelize(config.get('name'), config.get('user'), config.get('password'))

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')
module.exports['shownotes'] = sequelize.import(__dirname + '/shownotes.js')

module.exports['episode'].hasMany(module.exports['shownotes'], {as: 'shownotes_translations'})

module.exports.sequelize = sequelize