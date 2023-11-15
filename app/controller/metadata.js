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
    const metadataurl = `http://169.254.169.254${currPath}`
    const responseData = await fetch(metadataurl)
    const responseTextData = await responseData.text();
    logger.info("fetched latest metadata");
    logger.debug(`latest-metadata ${responseTextData}`);
    sendResponse(res,200,responseTextData);
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
        return token;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
};

module.exports = fetchlatestmetadata;
