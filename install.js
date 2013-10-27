var Sequelize = require('sequelize')
var nconf = require('nconf')
var path = require('path')
GLOBAL.config = nconf.file({ file: path.join(__dirname, 'app', 'config.json') })
var dbConfig = config.get('db')

var sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password)

var models = require('./app/models')
var Episode = models.episode
var Shownotes = models.shownotes
var User = models.user
var Tag = models.tag

Episode.sync({force: true})
Shownotes.sync({force: true})
User.sync({force: true})
Tag.sync({force: true})