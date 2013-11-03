var passport = require("passport")
var passportTwitter = require("passport-twitter")

module.exports = function(app, key, secret) {
	var twitterConfig = { key: key, secret: secret }

	var TwitterStrategy = passportTwitter.Strategy
	passport.serializeUser(function(user, done) {
      console.log('serialize')
    	done(null, user._id)
	})
	passport.deserializeUser(function(obj, done) {
    	models.User.findOne(obj, function(err, user) {
        console.log(user)
    		done(err, user)
    	})
  	})

	if (!twitterConfig || !twitterConfig.key || !twitterConfig.secret) {
		console.log('FATAL ERROR: You must specify a twitter consumer key and consumer secret in the configuration to run the server.')
		process.exit(1)
	}

	passport.use(new TwitterStrategy({
		consumerKey: twitterConfig.key,
		consumerSecret: twitterConfig.secret,
		callbackURL: 'http://localhost:'+ (config.get('port') || 3000) +'/auth/twitter/callback'
	}, function(token, tokenSecret, profile, done) {
		models.User.findOneAndUpdate({twitter_id: profile.id}, {
			name: profile.displayName,
			twitter_id: profile.id,
			twitter_username: profile.username,
			twitter_access_token: token,
			twitter_access_secret: tokenSecret
		}, function(err, user) {
			if (err) {
				done(err, null)
				return
			}
			if (!user) {
				models.User.create({
					name: profile.displayName,
					twitter_id: profile.id,
					role: 4,
					twitter_username: profile.username,
					twitter_access_token: token,
					twitter_access_secret: tokenSecret
				}, function(err, newUser) {
					done(err, newUser)
				})
			} else {
				done(err, user)
			}
		})
	}))

	app.use(passport.initialize())
	app.use(passport.session())

	return passport
}