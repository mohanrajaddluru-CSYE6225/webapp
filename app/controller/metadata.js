const express = require('express');
const router = express.Router();
const logger = require('../../logger/developmentLogs.js');


const sendResponse = (res, statusCode, message) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(statusCode).json(message);
};

const fetchlatestmetadata = async (req,res) =>
{
    const TOKEN = await fetchToken();
    const currPath = req.path;
    const metadataurl = 'http://169.254.169.254${currPath}'
    res = await fetch(metadataurl, {
        headers: {
            'X-aws-ec2-metadata-token': TOKEN
        },
    })
    console.log(res);
    logger.info("fetched latest metadata");
    sendResponse(res,200,res);
}


const fetchToken = async () => {
    try {
        const response = await fetch("http://169.254.169.254/latest/api/token", {
            method: "PUT",
            headers: {
                'X-aws-ec2-metadata-token-ttl-seconds': '3600'
            }
        });
        const token = await response.text();
        console.log(token);
        return token;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
};

module.exports = fetchlatestmetadata;
