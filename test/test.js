var should = require('chai').should()
var request = require('supertest')

var path = require('path')
var rootDir = path.join(__dirname, '..')


var app = require(rootDir + '/app/server.js').app
describe('Basic Tests', function() {
	it('Make sure app runs', function(done) {
		request(app).get('/').expect('Content-Type', /html/).expect(200, done)
	})
})