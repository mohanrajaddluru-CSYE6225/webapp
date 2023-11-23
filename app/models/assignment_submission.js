const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../database.js');
var sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes');


function validateURL(value)
{

  return true;
}



const submissions = sequelize.define('submissions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      readOnly : true,
    },
    assignment_id: {
      type : DataTypes.UUIDV4,
      allowNull:false,
    },
    submission_url: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {validateURL}
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

syncAndAlterTable(submissions);



module.exports = {submissions};

