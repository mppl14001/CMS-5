var mongoose = require('mongoose')

// connect
require("./connect")

GLOBAL.User = require(__dirname + '/user.js')
GLOBAL.Episode = require(__dirname + '/episode.js')
GLOBAL.Shownotes = require(__dirname + '/shownotes.js')
GLOBAL.Tag = require(__dirname + '/tag.js')
GLOBAL.Transcription = require(__dirname + '/transcription.js')
