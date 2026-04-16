const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../lib/mongodb');
const Product = require('../../models/Product');
const sanityClient = require('../../lib/sanity');

// Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { category, sortBy, page = 1, limit = 12 } = req.query;

    const db = await connectToDatabase();
    let query = {};

    if (category) {
      query.category = category;
    }

    let sort = {};
    if (sortBy === 'price_asc') sort.price = 1;
    else if (sortBy === 'price_desc') sort.price = -1;
    else if (sortBy === 'newest') sort.createdAt = -1;
    else if (sortBy === 'rating') sort.rating = -1;

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        pages,
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const searchQuery = req.params.query;

    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
      ],
    });

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get categories
router.get('/categories/all', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const categories = await Product.distinct('category');

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;