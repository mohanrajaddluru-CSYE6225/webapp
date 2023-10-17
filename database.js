const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
console.log('DATABASE_USER:', process.env.DATABASE_USER);
console.log('DATABASE_PASSWORD:', process.env.DATABASE_PASSWORD);
console.log('DATABASE_HOST:', process.env.DATABASE_HOST);


const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME, 
    username: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql', // Change this based on your database
});

module.exports = sequelize;
