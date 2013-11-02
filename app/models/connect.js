var mongoose = require('mongoose')
var db = mongoose.connection

db.on('error', console.error)

module.exports = function(next) {
  db.once('open', next)
}

mongoose.connect('mongodb://localhost/codepilot-dev')