const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1', // or '127.0.0.1'
  username: 'root',
  password: 'Test@123',
  database: 'test',
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database successfully');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
}

// Perform database operations here

// Close the connection when done
async function close() {
  try {
    await sequelize.close();
    console.log('Connection to MySQL closed');
  } catch (error) {
    console.error('Error closing the connection:', error);
  }
}

// You can call the connect function to establish the connection
connect();
// Perform your database operations here
// Don't forget to call the close function when you're done
// close();
