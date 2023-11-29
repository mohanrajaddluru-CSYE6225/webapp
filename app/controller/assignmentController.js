const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User,Assignment,AssignmentCreator, Submissions } = require('../models/index.js');
const logger = require('../../logger/developmentLogs.js')
const publishSnsMessage = require('../../aws-sns-publish.js');



const { Op } = require('sequelize'); 
const { error } = require('winston');

const sendResponse = (res,statusCode, message) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(statusCode).json(message);
};


const getAssignmentbyID = async (req,res) => {
  const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      logger.error("Authentication not found");
       sendResponse(res,401);
      }
    else
    {
        const currentUser = await validateUser(authorizationHeader);
        if (currentUser)
        {
          const currentAssignment = await Assignment.findAll({
            where : {
              id : req.params.id
            }
          })
          if (currentAssignment.length !== 0)
          {
            logger.debug(`Assignment with ID ${req.params.id} fetched successfully`);
            logger.info("Assignemnt fetched succesfully")
            sendResponse(res,200,currentAssignment);
          }
          else
          {
            logger.error("No Assignments found");
            sendResponse(res,204);
          }
          
        }
        else{
          logger.error("User not authenticated");
          sendResponse(res,401);
        }
    }

}



const getUserAssignments = async(req,res) => 
{
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      logger.error("Authentication not found");
      sendResponse(res,401, "Un authenticated, authentication required");
    }
  else
  {
      const currentUser = await validateUser(authorizationHeader);
      if (currentUser)
      {
          var allAssignments = await Assignment.findAll({})
          logger.info("All user Assignemnts Data fetched succesfully")
          sendResponse(res,200,allAssignments);
      }
      else
      {
        logger.debug(`User not authenticated`)
        logger.info(`User Authentication failed`)
        sendResponse(res,401,"Un authenticated, authentication required");
      }
  }
}

const postAssignment = async (req,res) =>
{
  const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      logger.error("Authentication not found");
      sendResponse(res,401, "Authentication required");
      }

    const currentUser = await validateUser(authorizationHeader);

    if (currentUser)
    {
        try{
            const deadlineRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
            if (!Number.isInteger(req.body.points)) 
            {
              logger.error("Points is not supported")
              logger.info("Bad Request");
              sendResponse(res,400, "Bad request");
            }
            else if (!deadlineRegex.test(req.body.deadline)) 
            {
              logger.error("wrong deadline date format")
              logger.info("Bad Request");
              sendResponse(res, 400, "Bad request date deadline");
            }
            else
            {
              const assignment = await Assignment.create
              ({
                  //id : req.body.id,
                  name : req.body.name,
                  points : req.body.points,
                  num_of_attempts : req.body.num_of_attempts,
                  deadline : req.body.deadline,
                  assignment_created : new Date(),
                  assignment_updated : new Date()
              })

              const mappedAssignment = await AssignmentCreator.create
              ({
                  userId : currentUser.id,
                  assignmentId : assignment.id
              })
              logger.info(`Assignment ${assignment.id} created successfullt`);
              sendResponse(res,201,assignment);
            }
        }
        catch (error)
        {
          logger.error("bad request");
          sendResponse(res,400,"Bad request");
        }
    }
    else
    {
      sendResponse(res,401,"Authentication required");
    }

}


const removeAssignment = async (req,res) => {
  const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) 
    {
      logger.error("Authentication not found");
      sendResponse(res,401,"Authentication required");
    }
    else
    {
      const currentUser = await validateUser(authorizationHeader);
      if (currentUser)
      {
        var assignmentListForCurrentUser = await currUserAsignments(currentUser)
          const index = assignmentListForCurrentUser.indexOf(req.params.id);
          if (index !== -1)
          {
            var currSubmissions = await Submissions.findAll(
              {
                where:
                {
                  assignment_id: req.params.id
                }
              }
            ) 
            console.log(currSubmissions, "These are current submission");
            if (currSubmissions.length >= 1)
            {
              logger.info(`Assignment with ID : ${req.params.id} cannot be deleted because of Associated Submissions`);
              sendResponse(res,403,"Submissions are associated with this assignment");
            }
            else
            {
              logger.info(`Assignment with ID : ${req.params.id} will be deleted because of No Associated Submissions`);
              const removeFromAssignments = await Assignment.destroy({
                where : {
                  id : req.params.id
                }
              })

              logger.info(`Assignment with ID : ${req.params.id} deleted because of No Associated Submissions`);

              const removeFromAssignmentCreator = await AssignmentCreator.destroy({
                where : {
                  assignmentId: req.params.id
                }
              })

              logger.info(`Assignment with ID : ${req.params.id} deleted because of No Associated Submissions`);

              if (removeFromAssignments > 0 && removeFromAssignmentCreator)
              {
                logger.info("Assignment deleted successfully");
                logger.debug(`Assignment ${req.params.id} deleted successfully`);
                sendResponse(res,204,"Assignment removed");
              }
              else
              {
                sendResponse(res,400,"Bad Request");
              }
            }
          }
          else
          {
            sendResponse(res,403);
          }
      }
      else
      {
        logger.debug("Un authorized request");
        return res.status(401).json("Unauthorized request");
      }
    }
}



async function deadlineCheck(currAssignment) {
  const deadline = new Date(currAssignment.deadline)
  const currentDate = new Date()
  console.log(deadline, currentDate)
  if (currentDate <= deadline )
  {
    logger.info(`Dealine not passed for curent assignment with id ${currAssignment.id}, deadline - ${deadline}, currentDate - ${currentDate}`)
    return true;
  }
  else
  {
    logger.info(`Deadline passed for current assignment - ${currAssignment.id}`);
    return false;
  }
}

async function maximumSubmissionsCheck(currSubmissions, currAssignment){
  const currSubmissionsLength = currSubmissions.length;
  const maxAllowedSubmissions = currAssignment.num_of_attempts;
  console.log(currSubmissionsLength, maxAllowedSubmissions )
  if (currSubmissionsLength < maxAllowedSubmissions)
  {
    logger.info(`Number of attempts not reached for assignment - ${currAssignment.id}`);
    return true;
  }
  else
  {
    logger.info(`Maximum Number of attempts reached for assignment - ${currAssignment.id}`);
    logger.debug(`Maximum Number of attempts reached for assignment - ${currAssignment.id} with current sumbissions - ${currSubmissions}`);
    return false;
  }
}



const submissionAssignment = async(req,res) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) 
  {
    logger.debug("Authentication not found");
    sendResponse(res,401,{ "message" : "Authentication required" });
  }
  else
  {
    const currentUser = await validateUser(authorizationHeader);
    if (currentUser)
    {
      console.log(currentUser, "this is the current user details");
      var currAssignment = await Assignment.findOne(
      {
        where : 
        {
          id : req.params.id
        }
      })
      logger.debug(`Maximum attempts for Assignment ${currAssignment.name} is ${currAssignment.num_of_attempts}`)
      const num_of_attempts = currAssignment.num_of_attempts;
      const deadline = currAssignment.deadline;

      var currSubmissions = await Submissions.findAll(
        {
          where:
          {
            assignment_id: req.params.id,
            account_id: currentUser.id
          }
        }
      )

      console.log(currSubmissions , "these are current submission");


      logger.info(`${currSubmissions.length} submissions are submitted already for ${req.params.id}`);
      logger.info(`${currAssignment.deadline} is deadline for current Assignment with ID ${req.params.id}`);
      logger.debug(`${ JSON.stringify(currSubmissions)} are the submission details for ${req.params.id}`);
      if ( await deadlineCheck(currAssignment) && (await maximumSubmissionsCheck(currSubmissions, currAssignment)))
      {
        try
        {
          const submission = await Submissions.create(
            {
              assignment_id: req.params.id,
              submission_url: req.body.submission_url,
              account_id : currentUser.id,
              submission_date: new Date(),
              submission_updated: new Date()
            }
          )
          const dataForSnsMessage = {
            submission_url : req.body.submission_url,
            user_email : currentUser.email,
            assignmentID: req.params.id,
            submissionID: submission.id,
            assignmentName: await currAssignment.name,
            assignmentCount: currSubmissions.length + 1
          }

          logger.debug(`Data is passed to sns function`);

          await publishSnsMessage(dataForSnsMessage);

          logger.info("Message passed to SNS TOPIC")
          sendResponse(res,201,submission);
        }
        catch (error)
        {
          logger.info("Error in submitting the assignment")
          logger.error(`Error in submitting with below error ${error}`);
          sendResponse(res,400,error.message);
        }
      }
      else
      {
        logger.info("Deadline passed or Maximum Subissions limit reached");
        sendResponse(res,403, {"message" : "Deadline passed or Maximum Subissions limit reached"});
      }
    }
    else
    {
      sendResponse(res,401, {"message" : "User does not exist"});
    }
  }
}


  
const updateAssignment = async(req,res) => {
  const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      logger.debug("Authentication not found");
      sendResponse(res,401,{ "message" : "Authentication required" });
      }
      else
      {
        const currentUser = await validateUser(authorizationHeader);
        if (currentUser)
        {
          try{
            const deadlineRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
            if (!Number.isInteger(req.body.points)) {
              sendResponse(res,400, "Bad request");
            }
            else if (!deadlineRegex.test(req.body.deadline)) 
            {
              logger.error("wrong deadline date format")
              logger.info("Bad Request");
              sendResponse(res, 400, "Bad request date deadline");
            }
            else
            {
              var assignmentListForCurrentUser = await currUserAsignments(currentUser)
              const index = assignmentListForCurrentUser.indexOf(req.params.id);
              if (index !== -1)
              {
                var values = req.body;
                if (values.hasOwnProperty('assignment_created') || values.hasOwnProperty('assignment_updated'))
                {
                  delete values.assignment_created;
                  delete values.assignment_updated;
                }
                const updatedValues = {
                  ...values,
                  "assignment_updated": new Date()
                };
                const updatedAssignment = await Assignment.update( updatedValues, {
                  where : {
                    id : req.params.id
                  }
                })
                logger.debug(`Assignment with ID: ${req.params.id}`)
                logger.info("Assignment Updated successfully");
                sendResponse(res,204);
              }
              else
              {
                logger.debug(`Assignment with ID: ${req.params.id} is not allowed to update by current user`)
                sendResponse(res,403,{"message" : "error posting data"});
              }
            }
          }
          catch{
            logger.info("user data update failed")
            sendResponse(res,400, {"message" : " bad request data"});
          }
        }
        else
        {
          logger.debug(`Assignment with ID: ${req.params.id} is not allowed to update by current user`)
          sendResponse(res,403, {"message" : "Authentication required"});
        }
        }
      }



const validateUser = async (authorizationHeader) => {
    try {
      // Extract the base64-encoded credentials from the Authorization header
      const base64Credentials = authorizationHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
      console.log(password);
  
      // Find the user by username
      const user = await User.findOne({ where: { email: username } });
  
      // If no user is found, return null (user not found)
      if (!user) {
        //console.log("I am returning null");
        return null;
      }
  
      // Compare the provided password with the hashed password in the database
      //console.log("i am going here now")
      const passwordMatch = await bcrypt.compare(password, user.password);
      //console.log("password is matched here")
      //console.log(passwordMatch)
  
      // If the passwords match, return the user object; otherwise, return null
      if (passwordMatch) {
        //console.log(user)
        return user;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error while validating user:', error);
      return 0;
    }
};



const currUserAsignments = async(presentUser) => {
    var curr_assignment = await AssignmentCreator.findAll({
        where :
        {
            userId : presentUser.id
        }
    });

    var assignmentIdForCurrUser = [];

    for (var i=0 ; i<curr_assignment.length;i++)
    {
        assignmentIdForCurrUser.push(curr_assignment[i].assignmentId);
    }
    var currUserAsignments = await Assignment.findAll({
        where: {
            id: {
                [Op.in] : assignmentIdForCurrUser
            }
        }

    });
    return assignmentIdForCurrUser;

}


module.exports = {
  getAssignmentbyID,
  getUserAssignments,
  postAssignment,
  removeAssignment,
  updateAssignment,
  submissionAssignment
};