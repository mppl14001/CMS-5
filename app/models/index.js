var Sequelize = require('sequelize')

var sequelize = new Sequelize(config.get('name'), config.get('user'), config.get('password'))

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')

module.exports.sequelize = sequelize