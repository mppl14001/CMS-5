var mongoose = require('mongoose')

var db = mongoose.createConnection(config.get('db'))

db.on('error', console.error)

module.exports = db