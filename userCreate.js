const { User,Assignment } = require('./models/index.js');
const { uuid } = require('uuidv4');
const { parse } = require('csv-parse');
const fs = require('fs');
const bcrypt = require('bcrypt');

const { createUsers } = require('./util/bootstrapdb.js');

function processCSVFile () {
    console.log("inside csv process");
    fs.createReadStream("./opt/user.csv")
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


module.exports = { processCSVFile };