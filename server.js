import dns from 'node:dns'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Force reliable DNS resolution
dns.setServers(['8.8.8.8', '1.1.1.1'])

// Load environment variables
dotenv.config()

// Import config and middleware
import './config/cloundinary.js'
import { createRateLimiter } from './middleware/authMiddleware.js'

// Import routes
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import contentRoutes from './routes/contentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

// Initialize app
const app = express()

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Apply rate limiting
app.use(createRateLimiter())

// Routes
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/customers', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/payments', paymentRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🔥 KKings Jewellery API Running',
    status: 'active',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// MongoDB Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI
    
    if (!uri) {
      throw new Error('MONGO_URI is missing from your .env file!')
    }

    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('❌ MongoDB Connection Error:')
    console.error(`Reason: ${err.message}`)
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('💡 TIP: Check your MongoDB Atlas "Network Access" and ensure 0.0.0.0/0 is added.')
    }
    
    process.exit(1)
  }
}

connectDB()

// Start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📝 API Documentation: http://localhost:${PORT}/api`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`)
  server.close(() => process.exit(1))
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed')
      process.exit(0)
    })
  })
})

export default app