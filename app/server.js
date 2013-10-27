// Node Module Requirements
var path = require('path')
var nconf = require('nconf')
var passport = require('passport')
var passportTwitter = require('passport-twitter')
var Sequelize = require('sequelize')
var async = require('async')
var express = require('express')
var exphbs = require('express3-handlebars')

// Config
GLOBAL.config = nconf.file({ file: path.join(__dirname, 'config.json') })
var twitterConfig = config.get('twitter')
var dbConfig = config.get('db')

// Models
var models = require('./models')
var Episode = models.episode
var Shownotes = models.shownotes
var User = models.user

// DB
var sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password)

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
		role: 5,
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

app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/'}), function(req, res) {
	res.redirect('/')
})

app.get('/logout', function(req, res) {
	req.logout()
	res.redirect('/')
})

app.get('/:id(\\d+)', function(req, res) {

	var episodeNumber = parseInt(req.param('id'), 10)

	if (episodeNumber) {

		Episode.find(episodeNumber).success(function(episode) {

			if (episode) {
				// Return episode
				res.end()
			} else {
				res.send(404, 'Episode not found.')
			}
		})
	}
})

app.get('/admin', /*requireAdmin,*/ function(req, res) {
	var data = {
		boxes: [
			{
				title: "Video views today",
				data: 0
			},
			{
				title: "Videos awaiting approval",
				data: 0
			},
			{
				title: "Transcriptions awaiting approval",
				data: 0
			},
			{
				title: "Some title here",
				data: "Data"
			},
			{
				title: "Some title here",
				data: "Data"
			},
			{
				title: "Some title here",
				data: "Data"
			}
		]
	}
	async.parallel([
		function(callback) { // Total views
			callback(null, '12,428')
		}, 
		function(callback) { // Videos awaiting approval
			sequelize.query('SELECT * FROM Episodes WHERE approved = 0').success(function(query) {
				var grammar = query.length === 1 ?
							  'Video awaiting approval' :
							  'Videos awaiting approval'
				callback(null, [grammar, query.length])
			})
		},
		function(callback) {
			callback(null, 15)
		}
	],
	function(err, callback) {
		for (var i in callback) {
			if (typeof(callback[i]) === 'object') { // Grammar easter egg
				data['boxes'][i].title = callback[i][0]
				data['boxes'][i].data = callback[i][1]
			} else {
				data['boxes'][i].data = callback[i]
				if (i == callback.length - 1) res.render('admin/admin', data)				
			}
		}
	})
})

app.get('/admin/episodes', /*requireAdmin,*/ function(req, res) {
	sequelize.query('SELECT * FROM Episodes WHERE approved = 1').success(function(query) {
		if (query.length > 0) {
			var data = {
				videos: []
			};
			data['videos'] = query;
			for (var i=0;i<data['videos'].length;i++) {
				var element = data['videos'][i]
				var eId = element.id
				sequelize.query('SELECT * FROM Shownotes WHERE EpisodeId = ? LIMIT 1', null, {raw: true}, [eId]).success(function(shownotes) {
					shownotes[0].content = shownotes[0].content.toString()
					shownotes[0].shortened = shownotes[0].content.replace(/(([^\s]+\s\s*){30})(.*)/,"$1…")
					if (shownotes) {
						element.shownotes = shownotes
					} else {
						element.shownotes = null
					}
					console.log(element)
					res.render('admin-episodes', data)
				})
			}
		} else {
			res.render('admin/admin-episodes')
		}
	})
})

app.get('/admin/episodes/pending', /*requireAdmin,*/ function(req, res) {
	sequelize.query('SELECT * FROM Episodes WHERE approved = 0').success(function(query) {
		if (query.length > 0) {
			var data = {
				videos: []
			}
			data['videos'] = query;
			for (var i=0;i<data['videos'].length;i++) {
				var element = data['videos'][i]
				var eId = element.id
				sequelize.query('SELECT * FROM Shownotes WHERE EpisodeId = ? LIMIT 1', null, {raw: true}, [eId]).success(function(shownotes) {
					shownotes[0].content = shownotes[0].content.toString()
					shownotes[0].shortened = shownotes[0].content.replace(/(([^\s]+\s\s*){30})(.*)/,"$1…")
					if (shownotes) {
						element.shownotes = shownotes
					} else {
						element.shownotes = null
					}
					console.log(element)
					res.render('admin/admin-episodes-pending', data)
				})
			}
		} else {
			res.render('admin/admin-episodes-pending')
		}
	})
})

app.get('/admin/episodes/pending/:id(\\d+)', /*requireAdming,*/ function(req, res) {
	
	res.render('admin/admin-episodes-specific')
})

app.get('/admin/episodes/:id(\\d+)', /*requireAdmin,*/ function(req, res) {
	res.render('admin/admin-episodes-specific')
})

app.get('/admin/users', /*requireAdmin,*/ function(req, res) {
	res.render('admin/admin-users')
})

app.get('/admin/users/:id(\\d+)', /*requireAdmin,*/ function(req, res) {
	res.render('admin/admin')
})

app.listen(config.get('port') || 3000)

// Passport roles

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
