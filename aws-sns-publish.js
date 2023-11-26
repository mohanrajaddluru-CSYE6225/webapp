require('dotenv').config();

const logger = require('./logger/developmentLogs.js');

const AWS = require('aws-sdk');

// const awsProfile = 'mohan-dev-iam'

// AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: awsProfile });

const awsRegion = process.env.AWSREGION;

AWS.config.update({ region: awsRegion });

const sns = new AWS.SNS();

const topicArn = process.env.SNSTOPICARN;

const publishSnsMessage = async(req,res) => {

  const message = `Assignment posted by User - ${req.user_email} for Assignment ID - ${req.assignmentId}`;

  const attributes = {
    submission_url : {
      DataType: "String",
      StringValue: req.submission_url
    },
    user_email : {
      DataType: "String",
      StringValue: req.user_email
    },
    assignmentID : {
      DataType: "String",
      StringValue: req.assignmentID,
    },
    submissionID : {
      DataType: "String",
      StringValue: req.submissionID,
    },
    assignmentName : {
      DataType: "String",
      StringValue: req.assignmentName,
    }
  }

  const params = {
    TopicArn: topicArn,
    Message: message,
    MessageAttributes : attributes
  };

  console.log(params);

  sns.publish(params, (err, data) => {
    if (err) 
    {
      logger.info(`Error in publishing the message to SNS`)
      return
    } 
    else 
    {
      logger.info( ` Successfully Published Message to SNS with Message ID -  ${data.MessageId}`);
      return 
    }
  });

}

module.exports = publishSnsMessage;