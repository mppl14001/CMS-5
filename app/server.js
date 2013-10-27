// Node Module Requirements
var path = require('path')
var nconf = require('nconf')
var passport = require('passport')
var passportTwitter = require('passport-twitter')
var Sequelize = require('sequelize')
GLOBAL.async = require('async')
var express = require('express')
var exphbs = require('express3-handlebars')

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
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.use(express.cookieParser())
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.session({ secret: 'CodePilot' }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())

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

app.get('/admin/episodes/pending/:id(\\d+)',/*requireAdming,*/ adminController.getPendingEpisodeById)

app.get('/admin/episodes/:id(\\d+)',/*requireAdmin,*/ adminController.getEpisodeById)

app.get('/admin/users',/*requireAdmin,*/ adminController.getUsers)

app.get('/admin/users/:id(\\d+)',/*requireAdmin,*/ adminController.getUserById)

// Admin APIs

app.post('/api/admin/episode/approve', adminController.postApproveScreencast)

app.post('/api/admin/user/add', adminController.addUser)

app.post('/api/admin/user/delete', adminController.deleteUser)

// Screencaster APIs

app.post('/api/approvedEpisodes', userController.getApprovedEpisodes)

app.listen(config.get('port') || 3000)
