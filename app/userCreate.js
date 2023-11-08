const { User,Assignment } = require('./models/index.js');
const { uuid } = require('uuidv4');
const { parse } = require('csv-parse');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const logger = require('../logger/developmentLogs.js');
//const parse = require('csv-parse');

const { createUsers } = require('./util/bootstrapdb.js');

function processCSVFile () {
    const csvFilePath = path.join(__dirname, 'opt', 'user.csv');
    fs.createReadStream(csvFilePath)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        createUsers(row[0], row[1], row[2], row[3]);
    })
    .on("error", function (error) {
        logger.error(`${error.message}`)
        // console.log(error.message);
    })
    .on("end", function () {
        logger.info("User data created successfully")
        // console.log("finished");
    });
}


module.exports = { processCSVFile };