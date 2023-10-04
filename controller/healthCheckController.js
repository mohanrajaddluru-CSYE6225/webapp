const express = require('express');
const sequelize = require('../database.js');
const router = express.Router();


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
        sendResponse(res,200);
        //res.status(200).json();
    }
    else
    {
        sendResponse(res,503);
        //res.status(503).json();
    }

    
}

const rejectOtherMethods = async (req,res) =>
{
    res.status(405).json();
}

  
async function checkConnection ()
{
    //console.log("eafVAFV");
    try{
        await sequelize.authenticate();
        return true
    }
    catch (error)
    {
        //console.error(error);
        return false;
    }
}


module.exports = { checkHealth, rejectOtherMethods };