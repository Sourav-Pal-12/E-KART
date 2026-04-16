const { MongoClient } = require('mongodb');

const uri = 'your_mongodb_connection_string'; // Replace with your MongoDB connection string
const options = {
  maxPoolSize: 10, // Specify max number of connections in the pool
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let db;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(uri, options);
    try {
      await client.connect();
      db = client.db(); // Use the database specified in the connection string
      console.log('Connected to Database');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
  return db;
};

const closeConnection = async () => {
  if (client) {
    try {
      await client.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Failed to close the database connection:', error);
    }
  }
};

module.exports = { connectToDatabase, closeConnection };