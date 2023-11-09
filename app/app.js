const express = require('express');
const sequelize = require('./database.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const bcrypt = require('bcrypt');
const {uuid} = require('uuidv4');
const bodyParser = require('body-parser');

const logger = require('../logger/developmentLogs.js');


const { UserSchema, AssignmentSchema} = require('./models/index.js');
const assignmentRoute = require('./routes/assignment.js');
const { processCSVFile } = require('./userCreate.js')
const  healthCheckRoutes  = require('./routes/healthCheck.js');

const { bootstrapDatabase } = require('./util/bootstrapdb.js');

const app = express();
app.use(bodyParser.json());


function isValidJson(req,res,next) {
    try 
    {
        JSON.parse(JSON.stringify(req.body));
        next();
    } 
    catch (error) 
    {
        return res.status(400).json();
    }
}


function isEmptyRequest(req, res, next) {
    if (Object.keys(req.body).length === 0 && Object.keys(req.params).length === 0) 
    {
        logger.info(`Empty request`);
        next();
    }
    else
    {
        logger.error(`Invalid request body for called method ${JSON.stringify(req.body)}`);
        return res.status(400).json();
    }
}


app.use('/v1/assignments', isValidJson, assignmentRoute);
app.use('/healthz', isValidJson, isEmptyRequest, healthCheckRoutes);

app.patch('*', (req, res) => {
    res.status(405).json("Method not allowed");
});

app.use('/', (req,res) => {
    res.status(405).json();
})

// app.use('*', (req,res) => {
//     res.status(404).json();
// })

// const { User,Assignment,AssignmentCreator } = require('./models');
// const { UUID, UUIDV4, UniqueConstraintError } = require('sequelize');

// const userExist = async (id) => {
//     try{
//         const users = await User.findAll({
//             where: {
//                 id : id
//             }
//         })
//         console.log(users);
//         return users.length>0;
//     }
//     catch (error)
//     {
//         console.error('Error while searching for the user:', error);
//         return false;
//     }
// }

function startServer() {
    const port = process.env.PORT || 8081;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}


async function main() {
    try {
      if (await bootstrapDatabase())
      {
        processCSVFile();
        startServer();
        console.log("success")
        logger.info('Application Started')
      }
      else
      {
        startServer();
        console.log("failure");
        logger.error(`Failed to connect Database, Application started and running at port ${process.env.PORT}`)
      }
    } catch (error) {
      console.error('Error in main:', error);
      logger.error(`Failed to start application on`)
    }
  }

main();

module.exports = app;
