var express = require("express")
var path = require('path')
var exphbs = require('express3-handlebars')
var RedisStore = require('connect-redis')(express)
var sessionStore = new RedisStore

var app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs({
	partialsDir: path.join(__dirname, 'views', 'admin', 'partials'),
	defaultLayout: path.join(__dirname, 'views', 'admin' , 'layouts', 'main.handlebars'),
	helpers: require(path.join(__dirname, 'views', 'admin', 'helpers'))
}))
app.use(express.cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(express.session({ secret: 'CodePilot', store: sessionStore }))
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app