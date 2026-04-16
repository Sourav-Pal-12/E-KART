const sanityClient = require('@sanity/client');
const { connectToDatabase } = require('../lib/mongodb');
const Product = require('../models/Product');

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-04-16',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const syncSanityToMongo = async () => {
  try {
    console.log('Starting Sanity to MongoDB sync...');

    // Connect to MongoDB
    const db = await connectToDatabase();
    console.log('Connected to MongoDB');

    // Fetch all products from Sanity
    const query = '*[_type == "product"]';
    const sanityProducts = await client.fetch(query);
    console.log(`Fetched ${sanityProducts.length} products from Sanity`);

    // Sync each product to MongoDB
    let syncedCount = 0;
    let errorCount = 0;

    for (const product of sanityProducts) {
      try {
        // Find or create product in MongoDB
        await Product.findOneAndUpdate(
          { _id: product._id },
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
            stock: product.stock,
            rating: product.rating,
          },
          { upsert: true, new: true }
        );
        syncedCount++;
      } catch (err) {
        console.error(`Error syncing product ${product._id}:`, err);
        errorCount++;
      }
    }

    console.log(`Sync completed: ${syncedCount} synced, ${errorCount} errors`);
    return {
      success: true,
      syncedCount,
      errorCount,
      total: sanityProducts.length,
    };
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { syncSanityToMongo };