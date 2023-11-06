const request = require('supertest')
const app = require('../app/app.js');
const chai = require('chai')
const expect = chai.expect

 


describe('Successes', function() {
    it('healthCheck to database', function(done) {
        request(app)
            .get('/healthz')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200);
                done();
            });
    });
});