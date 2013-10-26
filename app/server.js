var path = require('path')
GLOBAL.config = require('nconf').file({ file: path.join(__dirname, 'config.json') })

var models = require('./models')

var Episode = models.episode
var Shownotes = models.shownotes
var User = models.user

var express = require('express')
var app = express()

app.get('/', function(req, res){

})

app.get('/:id', function(req, res) {
  Episode.find(parseInt(req.param('id'), 10)).success(function(episodes) {
    // this gets the episode
    res.end()
  })
})

app.listen(config.get('port') || 3000)
