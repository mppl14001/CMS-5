var mongoose = require('mongoose')
var db = mongoose.connection

db.on('error', console.error)

module.exports = function(next) {
  db.once('open', function() {
    next()
  })
}