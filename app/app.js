const express = require('express');
const sequelize = require('./database.js');
const fs = require('fs');
const { parse } = require('csv-parse');
const bcrypt = require('bcrypt');
const {uuid} = require('uuidv4');
const bodyParser = require('body-parser');
require('dotenv').config();


const logger = require('../logger/developmentLogs.js');


const { UserSchema, AssignmentSchema} = require('./models/index.js');
const assignmentRoute = require('./routes/assignment.js');
const { processCSVFile } = require('./userCreate.js')
const  healthCheckRoutes  = require('./routes/healthCheck.js');
const getlatestmetadata = require('./routes/latestmetadata.js');

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


app.use('/v2/assignments', isValidJson, assignmentRoute);
app.use('/healthz', isValidJson, isEmptyRequest, healthCheckRoutes);
app.use('/metadata', getlatestmetadata);

app.patch('*', (req, res) => {
    res.status(405).json("Method not allowed");
});

app.use('/', (req,res) => {
    res.status(405).json();
})

function startServer() {
    const port = process.env.PORT || 8081;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

async function fetchInstanceId()
{
    const metadataURL = `http://169.254.169.254/latest/meta-data/instance-id`;
	var resdata = await fetch(metadataURL);
	resdata = await resdata.text();
	process.env.INSTANCEID = resdata;
}

async function main() {
    try {
      if (await bootstrapDatabase())
      {
        if (process.env.INFRA === 'AWS') {
            fetchInstanceId();
          }
        processCSVFile();
        startServer();
        console.log("success")
        logger.info('Application Started')
      }
      else
      {
        if (process.env.INFRA === 'AWS') {
            fetchInstanceId();
          }
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
