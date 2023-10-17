const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    database: 'test', 
    username: 'root', 
    password: 'Test@123',
    host: '127.0.0.1',
    dialect: 'mysql', // Change this based on your database
});

module.exports = sequelize;
