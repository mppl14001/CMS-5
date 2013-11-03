// Node Module Requirements
var nconf = require('nconf')
var path = require('path')
var passport = require('passport')
var passportTwitter = require('passport-twitter')
GLOBAL._ = require('lodash')

// Config
GLOBAL.config = nconf.argv()
					 .env()
					 .file({ file: path.join(__dirname, 'config.json') })
var twitterConfig = config.get('twitter')
var dbConfig = config.get('db')

if (!dbConfig || !dbConfig.name || !dbConfig.user) {
	console.log('FATAL ERROR: You must specify database information in the configuration to run the server.')
	process.exit(1)
}


// Models
GLOBAL.models = require('./models')

// Fixtures
if (config.get('seed-data')) {
	var fixtures = require('./misc/fixtures.js')
	fixtures()
}

// WILL'S DEBUG CODE

// var test = new models.Episode({
// 	id: 0,
// 	title: 'Hello, world',
// 	ytURL: 'http://google.com',
// 	published: false,
// 	approved: false,
// 	shownotes: [
// 		{
// 			text: 'ABCDEF',
// 			language: 'en'
// 		},
// 		{
// 			text: 'YOLOSWAG',
// 			language: 'es'
// 		},
// 	]
// })

// test.save()

// Controllers
var adminController = require('./controllers/admin.js')
var episodeController = require('./controllers/episode.js')
var userController = require('./controllers/user.js')
var screencasterController = require('./controllers/screencaster.js')
var searchController = require('./controllers/search.js')

// Express
var app = require("./app")

var passport = require('./passport')(app, twitterConfig.key, twitterConfig.secret)

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

app.use(function(err, req, res, next) {
  console.error(err)
  res.redirect('/fail')
})

app.listen(config.get('port') || 3000)

module.exports.app = app
