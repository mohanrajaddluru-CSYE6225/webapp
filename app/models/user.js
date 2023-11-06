const { DataTypes, STRING } = require('sequelize');
const sequelize = require('../database.js');
var sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes');


const User = sequelize.define('accounts',{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      readOnly : true,
      //noUpdate: true
    },
    first_name: {
      type : DataTypes.STRING,
      allowNull:false
    },
    last_name: {
      type : DataTypes.STRING,
      allowNull:false
    },
    email: {
      type : DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate : {
        isEmail : true,
      },
    },
    password: {
      type : DataTypes.STRING,
      allowNull:false,
      writeOnly : true,

    },
    account_created: {
      type : DataTypes.DATE,
      readOnly : true,
    },
    account_updated: {
      type : DataTypes.DATE,
      readOnly : true,
    },
    //account_updated_1: DataTypes.DATE
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


syncAndAlterTable(User);

module.exports = {User};