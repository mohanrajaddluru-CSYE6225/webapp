const express = require('express');
const sequelize = require('../database.js');
const router = express.Router();

const logger = require('../../logger/developmentLogs.js');

const metricsLogger = require('../../metrics/metricslogger.js');


const sendResponse = (res, statusCode, message) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(statusCode).json(message);
  };


const checkHealth = async (req,res) => 
{
    const status = await checkConnection();
    
    if (status)
    {
        logger.info("Data base healthz check successful");
        sendResponse(res,200);
    }
    else
    {
        sendResponse(res,503);
    }

    
}

const rejectOtherMethods = async (req,res) =>
{
    logger.error("Method not supported for this endpoint");
    res.status(405).json();
}

  
async function checkConnection ()
{
    try{
        await sequelize.authenticate();
        return true
    }
    catch (error)
    {
        return false;
    }
}


module.exports = { checkHealth, rejectOtherMethods };