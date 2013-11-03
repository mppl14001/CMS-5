// Node Module Requirements
var nconf = 
var path = require('path')
var passport = require('passport')
var passportTwitter = require('passport-twitter')
GLOBAL._ = require('lodash')

// Config
GLOBAL.config = require('nconf').argv().env().file({ file: path.join(__dirname, 'config.json') })					 

// Models
GLOBAL.models = require('./models')

// Fixtures
if (config.get('seed-data')) { require('./misc/fixtures.js')() }

// Controllers
var adminController = require('./controllers/admin.js')
var episodeController = require('./controllers/episode.js')
var userController = require('./controllers/user.js')
var screencasterController = require('./controllers/screencaster.js')
var searchController = require('./controllers/search.js')

// Express
var app = require("./app")

var passport = require('./passport')(app, config.get('twitter').key, config.get('twitter').secret)

app.use(function(req, res, next) {
	res.locals.user = req.user
	res.locals.showNav = true // TODO: Hide if it needs to be hidden
	next()
})

// Router
require("./routes.js")(app, {
	adminController: adminController,
	episodeController: episodeController,
	userController: userController,
	screencasterController: screencasterController,
	searchController: searchController,
	passport: passport
})

app.use(app.router)

app.listen(config.get('port') || 3000)

module.exports.app = app
