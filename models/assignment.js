const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../database.js');
var sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes');



function validatePoints(value)
{
  if (value < 1 || value > 100 )
  {
    throw new Error('Points must be from 1 to 100');
  }
  return true;
}

function validateAttempts(value)
{
  if (value < 1 || value > 100 )
  {
    throw new Error('Attempts must be from 1 to 100');
  }
  if (!Number.isInteger(value))
  {
    throw new Error('Number of attempts must be an integer.');
  }
  return true;
}


const Assignment = sequelize.define('assignments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      readOnly : true,
    },
    name: {
      type : DataTypes.STRING,
      allowNull:false,
    },
    points: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate:{validatePoints}
    },
    num_of_attempts: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate: {validateAttempts}
    },
    deadline: {
      type : DataTypes.DATE,
      allowNull:false
    },
    assignment_created: {
      type : DataTypes.DATE,
      readOnly : true,
    },
    assignment_updated: {
      type : DataTypes.DATE,
      readOnly : true,
    },
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

syncAndAlterTable(Assignment);



module.exports = {Assignment};

