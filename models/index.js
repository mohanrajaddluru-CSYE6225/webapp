const { User } = require('./user.js');

const { Assignment } = require('./assignment.js');

const sequelize = require('../database.js');

const { AssignmentCreator } = require('./assignmentCreate.js');

// cont AssignmentCreator


module.exports = {
    User,
    Assignment,
    AssignmentCreator
}