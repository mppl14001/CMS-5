var passport = require("passport")
var passportTwitter = require("passport-twitter")

module.exports = function(key, secret) {
  var twitterConfig = { key: key, secret: secret }

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

  if (!twitterConfig || !twitterConfig.key || !twitterConfig.secret) {
    console.log('FATAL ERROR: You must specify a twitter consumer key and consumer secret in the configuration to run the server.')
    process.exit(1)
  }

  passport.use(new TwitterStrategy({
    consumerKey: twitterConfig.key,
    consumerSecret: twitterConfig.secret,
    callbackURL: 'http://localhost:'+ (config.get('port') || 3000) +'/auth/twitter/callback'
  }, function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      twitter_id: profile.id
    }, {
      name: profile.displayName,
      role: 4,
      twitter_id: profile.id,
      twitter_username: profile.username,
      twitter_access_token: token,
      twitter_access_secret: tokenSecret
    }).success(function(user, created) {
      if (!created) {
        user.updateAttributes({
          name: profile.displayName,
          twitter_id: profile.id,
          twitter_username: profile.username,
          twitter_access_token: token,
          twitter_access_secret: tokenSecret
        }).success(function(user) {
          return done(null, user)
        })
      }
      else {
        return done(null, user)
      }
    }).failure(function(error) {
      return done(error, null)
    })
  }))

  return passport
}