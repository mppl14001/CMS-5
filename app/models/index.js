var mongoose = require('mongoose')

var db = require('./connect')

var autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(db)

var mongoosastic = require('mongoosastic')

var UserSchema = require(__dirname + '/user.js')
var EpisodeSchema = require(__dirname + '/episode.js')
var TranscriptionSchema = require(__dirname + '/transcription.js')

UserSchema.plugin(autoIncrement.plugin, {field: 'id'})
EpisodeSchema.plugin(autoIncrement.plugin, {field: 'id'})
EpisodeSchema.plugin(mongoosastic)
TranscriptionSchema.plugin(autoIncrement.plugin, {field: 'id'})

module.exports.User = db.model('User', UserSchema)
module.exports.Episode = db.model('Episode', EpisodeSchema)
module.exports.Transcription = db.model('Transcription', TranscriptionSchema)