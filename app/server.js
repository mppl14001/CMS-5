var path = require('path')
GLOBAL.config = require('nconf').file({ file: path.join(__dirname, 'config.json') })

var models = require('./models')

var Episode = models.episode
var Shownotes = models.shownotes
var User = models.user

var twitterConfig = config.get('twitter')

var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy
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
	callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
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

var exphbs = require('express3-handlebars')

var express = require('express')
var app = express()
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.use(express.cookieParser())
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.session({ secret: 'CodePilot' }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', function(req, res){
	res.render('home', {
		user: req.user
	})
})

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/'}), function(req, res) {
	res.redirect('/')
})

app.get('/logout', function(req, res) {
	req.logout()
	res.redirect('/')
})

app.get('/episodes/:id', function(req, res) {
	Episode.find(parseInt(req.param('id'), 10)).success(function(episodes) {
		// this gets the episode
		res.end()
	})
})

app.listen(config.get('port') || 3000)

function requireViewer(req, res, next) {
	if (req.user && req.user.role === 4) {
		next()
	} else {
		res.redirect('/')
	}
}

function requireModerator(req, res, next) {
	if (req.user && (req.user.role === 3 || req.user.role === 1)) {
		next()
	} else {
		res.redirect('/')
	}
}

function requireScreencaster(req, res, next) {
	if (req.user && (req.user.role === 2 || req.user.role === 1)) {
		next()
	} else {
		res.redirect('/')
	}
}

function requireAdmin(req, res, next) {
	if (req.user && req.user.role === 1) {
		next()
	} else {
		res.redirect('/')
	}
}