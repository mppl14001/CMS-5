var path = require('path')
GLOBAL.config = require('nconf').file({ file: path.join(__dirname, 'config.json') })

var models = require('./models')

var Episode = models.episode
var Shownotes = models.shownotes
var User = models.user

var express = require('express')
var app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.cookieParser())
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.session({ secret: 'CodePilot' }))

var twitterConfig = config.get('twitter')

var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy
passport.serializeUser(function(user, done) {
	done(null, user)
})
passport.deserializeUser(function(obj, done) {
	User.find(obj.id).success(function(user) {
		done(null, user)
	}).failure(function(error) {
		done(error, null)
	})
})
passport.use(new TwitterStrategy({
	consumerKey: twitterConfig.key,
	consumerSecret: twitterConfig.secret,
	callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
}, function(token, tokenSecret, profile, done) {
	console.log(profile)
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
app.use(passport.initialize())
app.use(passport.session())

app.get('/', function(req, res) {
	res.send('')
})

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/auth/twitter'}), function(req, res) {
	res.redirect('/')
})

app.listen(config.get('port') || 3000)