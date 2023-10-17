const request = require('supertest')
const apps = require('./app.js');
const chai = require('chai')
const expect = chai.expect

 


    describe('Successes', function() {
        it('healthCheck to database ', function(done) {
            request(apps).get('/healthz').send({ }).end(function(err, res) {
                expect(res.statusCode).to.be.equal(200)
                done()
            })
        })
    })
