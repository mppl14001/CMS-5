// Node Module Requirements
var path = require('path')
var nconf = require('nconf')
var passport = require('passport')
var passportTwitter = require('passport-twitter')
var Sequelize = require('sequelize')
GLOBAL.async = require('async')
var express = require('express')
var exphbs = require('express3-handlebars')
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore

// Config
GLOBAL.config = nconf.file({ file: path.join(__dirname, 'config.json') })
var twitterConfig = config.get('twitter')
var dbConfig = config.get('db')

// DB
GLOBAL.sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password)

// Models
var models = require('./models')
var Episode = models.episode
var Shownotes = models.shownotes
var User = models.user

// Controllers
var adminController = require('./controllers/admin.js')
var episodeController = require('./controllers/episode.js')
var userController = require('./controllers/user.js')

// Passport
var TwitterStrategy = passportTwitter.Strategy
passport.serializeUser(function(user, done) {
	done(null, user.id)
})
passport.deserializeUser(function(obj, done) {
	User.find(obj).success(function(user) {
		done(null, user)
	}).failure(function(error) {
		done(error, null)
	})
})
passport.use(new TwitterStrategy({
	consumerKey: twitterConfig.key,
	consumerSecret: twitterConfig.secret,
	callbackURL: 'http://127.0.0.1:'+config.get('port')+'/auth/twitter/callback'
}, function(token, tokenSecret, profile, done) {
	User.findOrCreate({
		twitter_access_token: token
	}, {
		name: profile.displayName,
		role: 4,
		twitter_username: profile.username,
		twitter_access_token: token,
		twitter_access_secret: tokenSecret
	}).success(function(user) {
		return done(null, user) 
	}).failure(function(error) {
		return done(error, null)
	})
}))

// Express
var app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs({
	partialsDir: path.join(__dirname, 'views', 'partials'),
	defaultLayout: path.join(__dirname, 'views', 'layouts', 'main.handlebars')
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

app.get('/', function(req, res){
	res.render('home', {
		user: req.user
	})
})

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/fail'}), function(req, res) {
	res.redirect('/')
})

app.get('/logout', function(req, res) {
	req.logout()
	res.redirect('/')
})

app.get('/:id(\\d+)', episodeController.getEpisodeById)

app.get('/admin',/*requireAdmin,*/ adminController.get)

app.get('/admin/episodes',/*requireAdmin,*/ adminController.getEpisodes)

app.get('/admin/episodes/pending',/*requireAdmin,*/ adminController.getPendingEpisodes)

app.get('/admin/episodes/pending/:id(\\d+)',/*requireAdming,*/ adminController.getEpisodeById)

app.get('/admin/episodes/:id(\\d+)',/*requireAdmin,*/ adminController.getEpisodeById)

app.get('/admin/users',/*requireAdmin,*/ adminController.getUsers)

app.get('/admin/users/:id(\\d+)',/*requireAdmin,*/ adminController.getUserById)

// Admin APIs

app.post('/api/admin/episode/approve', adminController.approveScreencast)

app.post('/api/admin/episode/remove', adminController.approveScreencast)

app.post('/api/admin/user/add', adminController.addUser)

app.post('/api/admin/user/deactivate', adminController.deactivateUser)

app.post('/api/admin/user/activate', adminController.activateUser)

// Screencaster APIs

app.post('/api/approvedEpisodes', userController.postApprovedEpisodes)

app.post('/api/pendingEpisodes', userController.postPendingEpisodes)

app.listen(config.get('port') || 3000)
