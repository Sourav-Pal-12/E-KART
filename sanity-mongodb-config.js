// sanity-mongodb-config.js

// Import necessary modules
const sanityClient = require('@sanity/client');
const MongoClient = require('mongodb').MongoClient;

// Sanity client setup
const sanity = sanityClient({
  projectId: '<SANITY_PROJECT_ID>', // Replace with your Sanity project ID
  dataset: '<DATASET_NAME>', // Replace with your dataset name
  useCdn: true // `false` if you want to ensure fresh data
});

// MongoDB client setup
const mongoUrl = '<MONGODB_CONNECTION_STRING>'; // Replace with your MongoDB connection string
let mongoClient;

async function connectToMongoDB() {
  try {
    mongoClient = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

async function fetchDataFromSanity() {
  try {
    const data = await sanity.fetch('*[_type == "yourType"]');
    console.log('Fetched data from Sanity:', data);
    await saveDataToMongoDB(data);
  } catch (error) {
    console.error('Error fetching data from Sanity', error);
  }
}

async function saveDataToMongoDB(data) {
  try {
    const db = mongoClient.db('<DB_NAME>'); // Replace with your database name
    const collection = db.collection('<COLLECTION_NAME>'); // Replace with your collection name
    await collection.insertMany(data);
    console.log('Data saved to MongoDB');
  } catch (error) {
    console.error('Error saving data to MongoDB', error);
  }
}

// Main function to orchestrate the data flow
async function main() {
  await connectToMongoDB();
  await fetchDataFromSanity();
  mongoClient.close();
}

main();
