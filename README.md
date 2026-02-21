# KKings Jewellery - Backend API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Environment Variables](#environment-variables)
- [Deployment Guide](#deployment-guide)
- [Security](#security)

---

## Overview

Production-ready backend for KKings Jewellery e-commerce platform built with:
- **Node.js + Express.js** - Server framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Bcryptjs** - Password hashing (future implementation)

### Tech Stack
- Runtime: Node.js (v18+)
- Framework: Express.js 4.18
- Database: MongoDB (Atlas)
- Authentication: JWT
- File Storage: Cloudinary
- File Upload: Multer
- Environment: dotenv

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account
- Cloudinary account
- npm or yarn

### Local Development

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update with actual values:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kkings-jewellery

# JWT
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d

# Admin
ADMIN_PASSWORD=your_secure_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. **Start Development Server**
```bash
npm run dev
```

The server will run on `http://localhost:5000`

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Product Management

#### Get All Products
```
GET /api/products
Query Parameters:
  - category: Filter by category
  - search: Search products by name/description
  - page: Page number (default: 1)
  - limit: Items per page (default: 20)

Response:
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 3
    }
  }
}
```

#### Get Single Product
```
GET /api/products/:id
Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Product Name",
    "description": "...",
    "price": 5000,
    "category": "Rings",
    "images": ["url1", "url2", "url3", "url4"],
    "stock": 10
  }
}
```

#### Get Products by Category
```
GET /api/products/category/:category
Query: limit (default: 10)
```

#### Create Product (Admin Only)
```
POST /api/products
Headers: Authorization: Bearer <token>
Body: {
  "name": "Product Name",
  "description": "Description",
  "price": 5000,
  "selling_price": 4500,
  "category": "Rings",
  "images": ["url1", "url2", "url3", "url4"],
  "stock": 10,
  "sku": "SKU-001"
}
```

#### Update Product (Admin Only)
```
PUT /api/products/:id
Headers: Authorization: Bearer <token>
Body: { ...same as create... }
```

#### Delete Product (Admin Only)
```
DELETE /api/products/:id
Headers: Authorization: Bearer <token>
```

#### Get Product Statistics
```
GET /api/products/stats
Response:
{
  "totalProducts": 50,
  "lowStockProducts": 5,
  "categories": ["Rings", "Necklaces", ...],
  "avgPrice": 3500
}
```

---

### Order Management

#### Get All Orders (Admin Only)
```
GET /api/orders
Headers: Authorization: Bearer <token>
Query:
  - status: Filter by status (pending, processing, shipped, delivered, cancelled)
  - page: Page number
  - limit: Items per page
```

#### Get Single Order (Admin Only)
```
GET /api/orders/:id
Headers: Authorization: Bearer <token>
```

#### Create Order (Customer)
```
POST /api/orders
Body: {
  "items": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 5000,
      "quantity": 2,
      "selectedSize": "M",
      "image": "image_url"
    }
  ],
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "mobile": "9999999999",
    "streetAddress": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "total": 10000
}
```

#### Update Order Status (Admin Only)
```
PUT /api/orders/:id/status
Headers: Authorization: Bearer <token>
Body: {
  "status": "processing" | "shipped" | "delivered" | "cancelled"
}
```

#### Update Order Details (Admin Only)
```
PUT /api/orders/:id
Headers: Authorization: Bearer <token>
Body: {
  "notes": "...",
  "trackingNumber": "..."
}
```

#### Delete Order (Admin Only)
```
DELETE /api/orders/:id
Headers: Authorization: Bearer <token>
```

#### Get Order Statistics
```
GET /api/orders/stats
```

---

### Admin Authentication

#### Login
```
POST /api/admin/login
Body: {
  "password": "admin_password"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here"
  }
}
```

#### Verify Token
```
GET /api/admin/verify
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { "valid": true }
}
```

#### Logout
```
POST /api/admin/logout
Headers: Authorization: Bearer <token>
```

---

### Content Management

#### Get Content
```
GET /api/content/:type
Types: home, our-story, footer, page

Response:
{
  "success": true,
  "data": {
    "type": "home",
    "content": { ... },
    "data": { ... },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Save Content (Admin Only)
```
PUT /api/content/:type
Headers: Authorization: Bearer <token>
Body: {
  "content": { ... },
  "data": { ... },
  "metadata": { ... }
}
```

---

### Analytics

#### Get Order Analytics (Admin Only)
```
GET /api/analytics?range=30
Headers: Authorization: Bearer <token>
Query: range (days, default: 30)

Response:
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 100000,
      "totalOrders": 50,
      "avgOrderValue": 2000,
      "totalProductsSold": 150,
      "daysRange": 30
    },
    "statusBreakdown": {
      "pending": 5,
      "processing": 10,
      "shipped": 20,
      "delivered": 15,
      "cancelled": 0
    },
    "dailyData": { ... }
  }
}
```

#### Get Product Analytics (Admin Only)
```
GET /api/analytics/products
Headers: Authorization: Bearer <token>
```

#### Get Customer Analytics (Admin Only)
```
GET /api/analytics/customers
Headers: Authorization: Bearer <token>
```

---

### Image Upload

#### Upload Single Image (Admin Only)
```
POST /api/upload
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data
Body: FormData with "image" field

Response:
{
  "success": true,
  "data": {
    "url": "https://cloudinary.../image.jpg",
    "publicId": "kkings-jewellery/..."
  }
}
```

#### Upload Multiple Images (Admin Only)
```
POST /api/upload/multiple
Max 4 images per request
Headers:
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data
Body: FormData with "images" field (array)

Response:
{
  "success": true,
  "data": {
    "images": [
      { "url": "...", "publicId": "..." },
      ...
    ],
    "count": 4
  }
}
```

---

## Database Models

### Product Model
```javascript
{
  _id: ObjectId,
  name: String (required, max 100),
  description: String (required),
  price: Number (required, min 0),
  selling_price: Number (optional),
  category: String (required),
  images: [String], // Array of URLs, 1-4 images
  stock: Number (default 1, min 0),
  sku: String (unique, optional),
  isActive: Boolean (default true),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      selectedSize: String,
      image: String
    }
  ],
  customer: {
    firstName: String (required),
    lastName: String (required),
    email: String,
    mobile: String (required),
    streetAddress: String (required),
    city: String (required),
    state: String,
    zipCode: String (required)
  },
  total: Number (required, min 0),
  status: String (enum: pending, processing, shipped, delivered, cancelled),
  paymentStatus: String (enum: pending, paid, failed),
  notes: String,
  trackingNumber: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Content Model
```javascript
{
  _id: ObjectId,
  type: String (enum: home, our-story, footer, page, required),
  pageKey: String (unique, optional),
  title: String,
  data: Mixed,
  content: Mixed,
  metadata: Mixed,
  isPublished: Boolean (default true),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Authentication
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Admin Authentication
ADMIN_PASSWORD=123456

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS & Frontend
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

---

## Deployment Guides

### Deploy to Render

1. **Prepare for Production**
```bash
npm install
npm run build (if needed)
```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository

3. **Create New Service**
   - Type: Web Service
   - Runtime: Node
   - Build: `npm install`
   - Start: `npm start`

4. **Set Environment Variables**
   - Add all `.env` variables in Render dashboard

5. **Deploy**
   - Render auto-deploys on push to main branch

### Deploy to Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Set Environment Variables**
```bash
railway variables set MONGO_URI="..."
railway variables set JWT_SECRET="..."
# ... add all other variables
```

5. **Deploy**
```bash
railway up
```

### Deploy to AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro (free tier eligible)

2. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Node.js**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
node --version
```

4. **Clone Repository**
```bash
git clone https://github.com/your-repo/kkings-jewellery.git
cd kkings-jewellery/backend
npm install
```

5. **Create .env File**
```bash
nano .env
# Add all environment variables
```

6. **Install PM2** (Process Manager)
```bash
npm install -g pm2
pm2 start server.js --name "kkings-api"
pm2 startup
pm2 save
```

7. **Setup Nginx Reverse Proxy**
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/default

# Add:
# server {
#   listen 80;
#   server_name your-domain.com;
#   location / {
#     proxy_pass http://localhost:5000;
#   }
# }

sudo systemctl restart nginx
```

8. **Setup SSL with Certbot** (Optional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## Security Best Practices

### 1. **Environment Variables**
- Never commit `.env` file
- Use `.env.example` as template
- Store sensitive keys securely

### 2. **Database Security**
- Use MongoDB Atlas IP Whitelist
- Enable authentication
- Use strong passwords

### 3. **API Security**
- JWT tokens expire after 7 days
- Password is hashed client-side (future)
- Rate limiting: 100 requests per 15 minutes
- CORS configured for specific origins

### 4. **Image Upload**
- File size limit: 5MB
- Only image files accepted
- Uploaded to Cloudinary (secure CDN)
- Auto-folder organization

### 5. **Input Validation**
- All JSON inputs validated
- Email format validation
- Number ranges validated
- String length limits enforced

### 6. **Error Handling**
- Detailed errors in development
- Generic errors in production
- No sensitive data in error responses

---

## Scripts

### Development
```bash
npm run dev      # Start with nodemon auto-reload
```

### Production
```bash
npm start        # Start server
npm run build    # Build (if applicable)
```

### Maintenance
```bash
npm install      # Install dependencies
npm update       # Update packages
npm audit        # Security check
```

---

## Troubleshooting

### MongoDB Connection Error
**Issue**: `ECONNREFUSED` or `querySrv ECONNREFUSED`

**Solution**:
1. Check MongoDB Atlas network access
2. Add `0.0.0.0/0` to IP whitelist
3. Verify `MONGO_URI` is correct
4. Restart server

### Cloudinary Upload Fails
**Issue**: Upload returns 400 or 500 error

**Solution**:
1. Verify Cloudinary credentials in `.env`
2. Check file size (max 5MB)
3. Ensure only image files

### JWT Token Expired
**Issue**: `401 Unauthorized - Token expired`

**Solution**:
1. Clear localStorage on client
2. Login again to get new token
3. Check `JWT_EXPIRES_IN` setting

---

## Support & Contact

For issues or questions:
- Check API documentation above
- Review console logs for errors
- Validate JSON in API requests
- Test with Postman/Thunder Client

---

## License

ISC

---

**Last Updated**: February 2026
**Version**: 1.0.0
