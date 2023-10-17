const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME, 
    username: process.env.DATABASE_USER, 
    password: null,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql', // Change this based on your database
});

module.exports = sequelize;
