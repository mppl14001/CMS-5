var mongoose = require("./connect")

module.exports.User = require(__dirname + '/user.js')(mongoose)
module.exports.Episode = require(__dirname + '/episode.js')(mongoose)
module.exports.Shownotes = require(__dirname + '/shownotes.js')(mongoose)
module.exports.Tag = require(__dirname + '/tag.js')(mongoose)
module.exports.Transcription = require(__dirname + '/transcription.js')(mongoose)