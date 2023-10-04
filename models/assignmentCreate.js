const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../database.js');
var sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes');




const AssignmentCreator = sequelize.define('assignmentCreator', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      readOnly : true,
      //noUpdate: true
    },
    userId : {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    assignmentId : {
      type : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
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
  

syncAndAlterTable(AssignmentCreator);


module.exports = {AssignmentCreator};