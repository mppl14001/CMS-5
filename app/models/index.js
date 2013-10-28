var Sequelize = require('sequelize')

var dbConfig = config.get('db')

module.exports['episode'] = sequelize.import(__dirname + '/episode.js')
module.exports['shownotes'] = sequelize.import(__dirname + '/shownotes.js')
module.exports['user'] = sequelize.import(__dirname + '/user.js')
module.exports['tag'] = sequelize.import(__dirname + '/tag.js')
module.exports['transcriptions'] = sequelize.import(__dirname + '/transcription.js')

module.exports['episode'].sync()
module.exports['shownotes'].sync()
module.exports['user'].sync()
module.exports['tag'].sync()
module.exports['transcriptions'].sync()

module.exports['episode'].hasMany(module.exports['shownotes'], {as: 'shownotes_translations'})
module.exports['user'].hasMany(module.exports['episode'], {as: 'episodes'})
module.exports['episode'].hasOne(module.exports['user'], {as: 'author'})
module.exports['episode'].hasMany(module.exports['tag'], {as: 'tags'})
module.exports['tag'].hasMany(module.exports['episode'], {as: 'episode'})
module.exports['transcriptions'].hasOne(module.exports['episode'], {as: 'episode'})
module.exports['episode'].hasOne(module.exports['transcriptions'], {as: "transcript"})

module.exports.sequelize = sequelize