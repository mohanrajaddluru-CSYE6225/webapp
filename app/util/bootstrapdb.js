const { User,Assignment, AssignmentCreator } = require('../models/index.js');
const { uuid } = require('uuidv4');
const { parse } = require('csv-parse');
const fs = require('fs');
const bcrypt = require('bcrypt');

const sequelize = require('../database.js');



async function createUsers( firstname, lastname, emailID, passwd)
{
    try
    {
        const user = await User.create
        ({
            id: uuid(),
            first_name: firstname,
            last_name: lastname,
            password:  passwordHash(passwd,10),
            email: emailID,
            account_created: new Date(),
            account_updated: new Date(),
          });
          console.log(`${emailID} created successfully! with id : ${user.id}`);
    }
    catch (error)
    {
        if (error.original.errno === 1062)
        {
            console.error(`User ${emailID} already exist`);
        }
        else
        {
            console.error("Error",error.original);
        }
    }

};


function passwordHash(myPlaintextPassword,saltRounds)
{
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    return hash;
}


function processCSVFile () {
    console.log("inside csv process");
    fs.createReadStream("../opt/user.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        createUsers(row[0], row[1], row[2], row[3]);
    })
    .on("error", function (error) {
        console.log(error.message);
    })
    .on("end", function () {
        console.log("finished");
    });
}


async function bootstrapDatabase() {
    //console.log('inside the bootstrap')
    try {
      await sequelize.authenticate();
      console.log('Connected to the database');
      await sequelize.sync(); 
      console.log('Database bootstrapped successfully');
      return true;
    } 
    catch (error) 
    {
        console.log(error);
        if (error.original.errno === -61)
        {
            console.error("Connection refused error");
        }
        else
        {
            console.error('Error bootstrapping the database:', error);
        }
        return false;
    }
  }


module.exports = { createUsers, bootstrapDatabase };