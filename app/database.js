const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME, 
    username: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
});

module.exports = sequelize;
