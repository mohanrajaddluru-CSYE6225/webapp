const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { Op } = require('sequelize'); 

const { User,Assignment,AssignmentCreator } = require('../models/index.js');
const { getAssignmentbyID, getUserAssignments, postAssignment, removeAssignment, updateAssignment } = require('../controller/assignmentController.js');


function isEmptyRequest(req, res, next) {
    if (Object.keys(req.body).length === 0 && Object.keys(req.params).length === 0) 
    {
        console.log("this is empty request")
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





router.get('/',isEmptyRequest, getUserAssignments).get('/:id',isGetIDEmptyRequest,getAssignmentbyID);

router.post('/',postAssignment);

router.delete('/:id', isEmptyRequest, removeAssignment);

router.put('/:id', updateAssignment);

router.head('/', (req,res) => { console.log("test head");res.status(405).json()});


router.all('/', (req,res) => { res.status(405).json()});

module.exports = router;
