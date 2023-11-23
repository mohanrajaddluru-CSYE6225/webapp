const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const logger = require('../../logger/developmentLogs.js');
const { Op } = require('sequelize'); 

const metricsLogger = require('../../metrics/metricslogger.js');

const { User,Assignment,AssignmentCreator } = require('../models/index.js');
const { getAssignmentbyID, getUserAssignments, postAssignment, removeAssignment, updateAssignment } = require('../controller/assignmentController.js');


function isEmptyRequest(req, res, next) {
    if (Object.keys(req.body).length === 0 && Object.keys(req.params).length === 0) 
    {
        next();
    }
    else if (Object.keys(req.body).length === 0)
    {
        next();
    }
    else
    {
        return res.status(400).json();
    }
}

function isGetIDEmptyRequest(req, res, next) {
    if (Object.keys(req.body).length === 0) 
    {
        next();
    }
    else
    {
        return res.status(400).json();
    }
}

function containsSubmissionURL(req,res,next) {
    var submissionBody = req.body;
    if ( Object.keys(submissionBody).length === 1 && submissionBody.hasOwnProperty("submission_url"))
    {
        logger.info(`Submission posted for ID : ${req.params.id}`);
        next();
        // return res.status(201).json();
    }
    else
    {
        logger.info(`Submission post for ID: ${req.params.id} has invalid body`);
        logger.debug(`Submission post for ID: ${req.params.id} has body ${JSON.stringify(req.body)}`);
        return res.status(400).json();
    }
}






router.get('/', metricsLogger, isEmptyRequest, getUserAssignments).get('/:id',metricsLogger, isGetIDEmptyRequest,getAssignmentbyID);

router.post('/',metricsLogger, postAssignment).post('/:id/submission',metricsLogger, containsSubmissionURL);

router.delete('/:id', metricsLogger, isEmptyRequest, removeAssignment);

router.put('/:id', metricsLogger, updateAssignment);

router.head('/', (req,res) => { console.log("test head");res.status(405).json()});

router.all('/', (req,res) => { res.status(405).json()});

module.exports = router;
