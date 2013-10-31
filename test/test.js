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
		models.should.have.property('episode')
		models.episode.should.be.a('object')
		done()
	})
	it('should have shownotes property', function(done) {
		models.should.have.property('shownotes')
		models.shownotes.should.be.a('object')
		done()
	})
	it('should have user property', function(done) {
		models.should.have.property('user')
		models.user.should.be.a('object')
		done()
	})
	it('should have transcriptions property', function(done) {
		models.should.have.property('transcriptions')
		models.transcriptions.should.be.a('object')
		done()
	})
	it('should have tag property', function(done) {
		models.should.have.property('tag')
		models.tag.should.be.a('object')
		done()
	})
})
describe('Sequelize', function() {
	it('should be initialized', function(done) {
		sequelize.should.be.an('object')
		done()
	})
})