// Node Module Requirements
var path = require('path')
var nconf = require('nconf')
var passport = require('passport')
var passportTwitter = require('passport-twitter')
var Sequelize = require('sequelize')
GLOBAL.async = require('async')
var express = require('express')
var exphbs = require('express3-handlebars')
var RedisStore = require('connect-redis')(express)
var sessionStore = new RedisStore
GLOBAL.languages = require('languages')
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

// DB
GLOBAL.sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
	logging: config.get('logging:sequelize') || false
})
// Models
GLOBAL.models = require('./models')
GLOBAL.Episode = models.episode
GLOBAL.Shownotes = models.shownotes
GLOBAL.User = models.user
GLOBAL.Transcription = models.transcriptions
GLOBAL.Tag = models.tag

// Controllers
var adminController = require('./controllers/admin.js')
var episodeController = require('./controllers/episode.js')
var userController = require('./controllers/user.js')
var screencasterController = require('./controllers/screencaster.js')
var searchController = require('./controllers/search.js')

// Passport
var passport = require("./passport.js")(twitterConfig.key, twitterConfig.secret)

// Express
var app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs({
	partialsDir: path.join(__dirname, 'views', 'partials'),
	defaultLayout: path.join(__dirname, 'views', 'layouts', 'main.handlebars'),
	helpers: require("./views/helpers.js")
}))
app.use(express.cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(express.session({ secret: 'CodePilot', store: sessionStore }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())

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

app.listen(config.get('port') || 3000)

module.exports.app = app
