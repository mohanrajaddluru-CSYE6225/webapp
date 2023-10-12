const supertest = require('supertest');

const {app} = require('./app.js');

 

var assert = require('assert');

 

 

describe('Testing our Application', function () {

    it('Simple assert test', function () {

        assert.equal(1, 1);

    })
});