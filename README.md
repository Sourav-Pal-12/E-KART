# E-Kart - E-Commerce Platform

E-Kart is a modern e-commerce platform built with **Sanity CMS** and **MongoDB**, providing a seamless content management and data persistence solution.

## 🌟 Features

- **Sanity CMS Integration**: Manage products with a powerful headless CMS
- **MongoDB Database**: Fast and scalable data storage
- **Real-time Sync**: Automatically sync data between Sanity and MongoDB
- **Product Management**: Full CRUD operations for products
- **Search & Filter**: Advanced search and filtering capabilities
- **Category Management**: Organize products by categories
- **Rating & Reviews**: Customer reviews and ratings system

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Sanity CMS    │◄------->│   E-Kart Server  │
│  (Content Hub)  │         │   (Express.js)   │
└─────────────────┘         └────────┬─────────┘
                                     │
                            ┌────────▼──────────┐
                            │   MongoDB Atlas   │
                            │   (Data Store)    │
                            └───────────────────┘
```

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB Atlas Account
- Sanity.io Account

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Sourav-Pal-12/E-Kart.git
cd E-Kart
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:

```env
# Sanity Configuration
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekart?retryWrites=true&w=majority
MONGODB_DB_NAME=ekart

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Sanity Setup

#### Create Sanity Project
```bash
npm install -g @sanity/cli
sanity init
```

#### Create Product Schema in Sanity

Create a file `sanity/schemas/product.js`:

```javascript
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'originalPrice',
      title: 'Original Price',
      type: 'number',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'],
      },
    },
    {
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
};
```

## 🔧 Usage

### Start the Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Sync Sanity Data to MongoDB

#### Option 1: Using API Endpoint
```bash
curl -X POST http://localhost:5000/api/sync
```

#### Option 2: Using CLI
```bash
npm run sync
```

## 📡 API Endpoints

### Products

#### Get All Products
```bash
GET /api/products?category=Electronics&sortBy=price_asc&page=1&limit=12
```

**Query Parameters:**
- `category`: Filter by category
- `sortBy`: price_asc, price_desc, newest, rating
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "pages": 9,
    "currentPage": 1
  }
}
```

#### Get Single Product
```bash
GET /api/products/:id
```

#### Search Products
```bash
GET /api/products/search/laptop
```

#### Get Categories
```bash
GET /api/products/categories/all
```

### Sync

#### Trigger Sync
```bash
POST /api/sync
```

**Response:**
```json
{
  "success": true,
  "message": "Sync completed",
  "data": {
    "syncedCount": 50,
    "errorCount": 0,
    "total": 50
  }
}
```

## 📁 Project Structure

```
E-Kart/
├── lib/
│   ├── mongodb.js          # MongoDB connection
│   └── sanity.js           # Sanity client config
├── models/
│   └── Product.js          # Product schema
├── routes/
│   └── api/
│       └── products.js     # Product routes
├── sync/
│   └── syncSanityToMongo.js # Sync logic
├── server.js               # Main server file
├── package.json            # Dependencies
├── .env.example            # Environment template
└── README.md               # Documentation
```

## 🔄 Data Flow

1. **Content Creation**: Create/edit products in Sanity CMS
2. **Automatic Sync**: Run sync endpoint to fetch data
3. **MongoDB Storage**: Data persisted in MongoDB
4. **API Retrieval**: Frontend accesses data via REST APIs
5. **Display**: Products shown to customers

## 🛡️ Security

- Use environment variables for sensitive data
- Validate API tokens in Sanity
- Implement authentication for admin endpoints
- Use MongoDB connection string with strong passwords

## 📝 Best Practices

1. **Regular Syncing**: Schedule automatic syncs
2. **Error Handling**: Implement retry logic for failed syncs
3. **Caching**: Cache frequently accessed products
4. **Indexing**: Use MongoDB indexes for faster queries
5. **Validation**: Validate data in both Sanity and MongoDB

## 🐛 Troubleshooting

### Connection Issues
- Check MongoDB connection string
- Verify Sanity project ID and token
- Ensure network access is allowed

### Sync Failures
- Check error logs for details
- Verify all required fields in Sanity
- Check MongoDB database permissions

### Performance Issues
- Add proper indexes in MongoDB
- Use pagination for large datasets
- Implement caching strategies

## 📚 Documentation Links

- [Sanity.io Documentation](https://www.sanity.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Sourav Pal**
- GitHub: [@Sourav-Pal-12](https://github.com/Sourav-Pal-12)

---

**Happy Coding! 🚀**