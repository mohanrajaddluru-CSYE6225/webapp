const { DataTypes } = require('sequelize');
const sequelize = require('../database.js');
const logger = require('../../logger/developmentLogs.js');
// var sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes');

function isURL(input) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  if (!urlRegex.test(input))
  {
    logger.info(`Posted URL is not valid rejected by DB`);
    logger.debug(`Posted URL ${input}`);
    throw new Error ('Submitted URL is not valid');
  }
  logger.info(`given URL is valid`)
  return true;
}


const Submissions = sequelize.define('submissions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      readOnly : true,
    },
    assignment_id: {
      type: DataTypes.UUID,
      readOnly: true,
    },
    account_id: {
      type: DataTypes.UUID,
      readOnly: true,
    },
    submission_url:{
      type: DataTypes.STRING,
      readOnly: true,
      validate: {isURL}
    },
    submission_date: {
      type: DataTypes.DATE,
      readOnly: true
    },
    submission_updated: {
      type: DataTypes.DATE,
      readOnly: true
    }
},{
  timestamps: false, // Disable timestamps
  createdAt: false,  // Disable createdAt
  updatedAt: false
});

async function syncAndAlterTable(Model) {
  try {
    await Model.sync({ alter: true });
    console.log('Table altered successfully');
  } catch (error) {
    console.error(`Error altering table: ${Model}`, error);
  }
}

syncAndAlterTable(Submissions);


module.exports = {Submissions};