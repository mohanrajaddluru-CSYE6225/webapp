const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { Op } = require('sequelize'); 

const { User,Assignment,AssignmentCreator } = require('../models/index.js');
const { getAssignmentbyID, getUserAssignments, postAssignment, removeAssignment, updateAssignment } = require('../controller/assignmentController.js');




router.get('/',getUserAssignments).get('/:id', getAssignmentbyID);

router.post('/',postAssignment);

router.delete('/:id', removeAssignment);

router.put('/:id', updateAssignment);

router.all('*', (req,res) => { res.status(405).json()});

module.exports = router;
