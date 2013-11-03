var should = require('chai').should()
var request = require('supertest')

var path = require('path')
var rootDir = path.join(__dirname, '..')

var server = require(rootDir + '/app/server.js')
var app = server.app
describe('Basic Tests', function() {
	it('Make sure app runs', function(done) {
		request(app).get('/').expect('Content-Type', /html/).expect(200, done)
	})
})
describe('Models', function() {
	it('should be an object', function(done) {
		models.should.be.an('object')
		done()
	})
	it('should have episode property', function(done) {
		models.should.have.property('Episode')
		models.Episode.should.be.a('function')
		done()
	})
	it('should have shownotes property', function(done) {
		models.should.have.property('Shownotes')
		models.Shownotes.should.be.a('function')
		done()
	})
	it('should have user property', function(done) {
		models.should.have.property('User')
		models.User.should.be.a('function')
		done()
	})
	it('should have transcriptions property', function(done) {
		models.should.have.property('Transcription')
		models.Transcription.should.be.a('function')
		done()
	})
	it('should have tag property', function(done) {
		models.should.have.property('Tag')
		models.Tag.should.be.a('function')
		done()
	})
})
describe('Sequelize', function() {
	it('should be initialized', function(done) {
		sequelize.should.be.an('object')
		done()
	})
	it('should track changes', function(done) {
		var originalUserHistoryCount;
		var userInstance;
		async.series([
			function(callback) {
				sequelize.query('SELECT COUNT(*) FROM Users_history;').success(function(result) {
					originalUserHistoryCount = result[0]['COUNT(*)']
					callback(null, result)
				}).failure(function(error) {
					callback(error, null)
					done(error)
				})
			}, function(callback) {
				User.create({
					name: 'TEST123',
					role: 4,
					twitter_id: '123456789',
					twitter_username: 'TEST123',
					twitter_access_token: '<redacted>',
					twitter_access_secret: '<redacted>',
					active: false
				}).success(function(createdUser) {
					userInstance = createdUser
					callback(null, createdUser)
				}).failure(function(error) {
					callback(error, null)
					done(error)
				})
			}, function(callback) {
				userInstance.updateAttributes({
					role: 1
				}).success(function() {
					callback(null, null)
				}).failure(function(error) {
					callback(error, null)
					done(error)
				})
			}, function(callback) {
				userInstance.destroy().success(function() {
					callback(null, null)
				}).failure(function(error) {
					callback(error, null)
					done(error)
				})
			}, function(callback) {
				sequelize.query('SELECT COUNT(*) FROM Users_history;').success(function(result) {
					var diff = result[0]['COUNT(*)'] - originalUserHistoryCount
					if (diff >= 3) {
						done()
					} else {
						done(new Error('History tracking did not function properly.'))
					}
				})
			}
		])
	})
})