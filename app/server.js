var path = require('path')
GLOBAL.config = require('nconf').file({ file: path.join(__dirname, 'config.json') })

var models = require('./models')

var Episode = models.episode
var Shownotes = models.shownotes
var User = models.user

var express = require('express')
var app = express()

var exphbs = require('express3-handlebars')
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', function(req, res){
	res.render('home')
})

app.get('/:id', function(req, res) {
  Episode.find(parseInt(req.param('id'), 10)).success(function(episodes) {
    // this gets the episode
    res.end()
  })
})

app.listen(config.get('port') || 3000)
