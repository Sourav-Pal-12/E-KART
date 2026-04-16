const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectToDatabase, closeConnection } = require('./lib/mongodb');
const { syncSanityToMongo } = require('./sync/syncSanityToMongo');
const productsRouter = require('./routes/api/products');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Sync endpoint - Trigger Sanity to MongoDB sync
app.post('/api/sync', async (req, res) => {
  try {
    const result = await syncSanityToMongo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Products API routes
app.use('/api/products', productsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Database connection and server startup
const startServer = async () => {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down gracefully...');
      await closeConnection();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;