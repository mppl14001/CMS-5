GLOBAL.config = require('nconf').file({ file: 'config.json' })

var models = require('./models')

var Episode = models.episode
var Shownotes = models.shownotes

var express = require('express')
var app = express()

app.get('/', function(req, res){

})

app.listen(config.get('port') || 3000)