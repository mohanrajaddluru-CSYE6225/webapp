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


const username = 'foo@gmail.com';
const password = 'hello@123';

// Combine the username and password with a colon
const credentials = `${username}:${password}`;

// Encode the credentials as Base64
const base64Credentials = Buffer.from(credentials).toString('base64');



    describe('Successes', function() {
        it('Post data to database', function(done) {
            const authHeaders = {
                Authorization: `Basic ${base64Credentials}`,
            };
            const jsonData = {
                "name": "Assignment 01",
                "points": 10,
                "num_of_attempts": 3,
                "deadline": "2016-08-29T09:12:33.001Z"
              };
    
            request(apps)
            .post('/v1/assignments')
            .set(authHeaders)
            .send(jsonData)
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(201)
                done()
            })
        })
    })



    describe('Successes', function() {
        it('get assignments data', function(done) {
            const authHeaders = {
                Authorization: `Basic ${base64Credentials}`,
            };
            request(apps)
            .get('/v1/assignments')
            .set(authHeaders)
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200)
                done()
            })
        })
    })

