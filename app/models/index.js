const { User } = require('./user.js');

const { Assignment } = require('./assignment.js');

const sequelize = require('../database.js');

const { AssignmentCreator } = require('./assignmentCreate.js');

const { Submissions } = require('./submissions.js');


module.exports = {
    User,
    Assignment,
    AssignmentCreator,
    Submissions
}