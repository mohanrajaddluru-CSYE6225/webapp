const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User,Assignment,AssignmentCreator } = require('../models/index.js');


const { Op } = require('sequelize'); 

const sendResponse = (res, statusCode, message) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(statusCode).json(message);
};


const getAssignmentbyID = async (req,res) => {
  const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
       sendResponse(res,401);
      }
    else
    {
      console.log("I am here inside the controller");
        const currentUser = await validateUser(authorizationHeader);
        if (currentUser)
        {
          const currentAssignment = await Assignment.findAll({
            where : {
              id : req.params.id
            }
          })
          sendResponse(res,200,currentAssignment);
        }
        else{
          sendResponse(res,401);
          //return res.status(401).json("Unauthorized request");
        }
    }

}



const getUserAssignments = async(req,res) => 
{
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      sendResponse(res,401, "Un authenticated, authentication required");
    }
  else
  {
      const currentUser = await validateUser(authorizationHeader);
      if (currentUser)
      {
          var allAssignments = await Assignment.findAll({})
          sendResponse(res,200,allAssignments);
      }
      else
      {
        sendResponse(res,401,"Un authenticated, authentication required");
      }
  }
}

const postAssignment = async (req,res) =>
{
  const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      sendResponse(res,401, "Authentication required");
      }

    const currentUser = await validateUser(authorizationHeader);
    //console.log(currentUser.id);

    if (currentUser)
    {
        try{
            const points = parseInt(req.body.points, 10);
            if (!Number.isInteger(points)) 
            {
              throw new Error('points must be an integer');
            }
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
            console.log(assignment.id);
            sendResponse(res,201,assignment);
        }
        catch (error)
        {
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

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      sendResponse(res,401,"Authentication required");
        //return res.status(401).json({ message: 'Invalid Authorization header' });
      }
      else{
        const currentUser = await validateUser(authorizationHeader);
        if (currentUser)
        {
          var assignmentListForCurrentUser = await currUserAsignments(currentUser)
            //console.log(req.params.id, "i am the params id");
            const index = assignmentListForCurrentUser.indexOf(req.params.id);
            if (index !== -1)
            {
              const removeFromAssignments = await Assignment.destroy({
                where : {
                  id : req.params.id
                }
              })

              const removeFromAssignmentCreator = await AssignmentCreator.destroy({
                where : {
                  assignmentId: req.params.id
                }
              })

              if (removeFromAssignments > 0 && removeFromAssignmentCreator)
              {
                sendResponse(res,204,"Assignment removed");
              }
              else
              {
                sendResponse(res,400);
              }
              //console.log(currentAssignment);
            }
            else
            {
              sendResponse(res,403);
              //return res.status(400).json("Assignment id not found for the user");
            }
        }
        else{
            return res.status(401).json("Unauthorized request");
        }


        }
      }


const updateAssignment = async(req,res) => {
  const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      //const message = { "message" : "Authentication required" };
      sendResponse(res,401,{ "message" : "Authentication required" });
      }
      else
      {
        const currentUser = await validateUser(authorizationHeader);
        if (currentUser)
        {
          try{
            const points = parseInt(req.body.points, 10);
            if (!Number.isInteger(points)) 
            {
              throw new Error('points must be an integer');
            }
            var assignmentListForCurrentUser = await currUserAsignments(currentUser)
            const index = assignmentListForCurrentUser.indexOf(req.params.id);
            console.log(req.body);
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
              sendResponse(res,204,{"message" : "Posted data"});;
            }
            else
            {
              sendResponse(res,401,{"message" : "error posting data"});
            }
          }
          catch{
            sendResponse(res,400, {"message" : "bad request data"});
          }
          }
          else
          {
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
    //console.log("inside current user assignment")

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
  updateAssignment
};