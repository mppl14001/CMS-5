GLOBAL.config = require('nconf').file({ file: 'config.json' })
console.log(config.get('port'))

var models = require('./models')

var Episode = models.episode
var Shownotes = models.shownotes

var express = require('express')
var app = express()

Episode.create({ title: "hello", ytURL: "", published: true, approved: false })

app.get('/', function(req, res){

})

app.get('/:id', function(req, res) {
  Episode.find(parseInt(req.param('id'), 10)).success(function(episodes) {
    // this gets the episode
  })
})

app.listen(config.get('port') || 3000)
