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