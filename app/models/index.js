var mongoose = require('mongoose')

require("./connect")(function() {
	var User = require(__dirname + '/user.js')
	var Episode = require(__dirname + '/episode.js')
})