import express from 'express'
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress,
  getOrderHistory
} from '../controllers/userController.js'
import { protectCustomer } from '../middleware/customerAuth.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes (require authentication)
router.get('/profile', protectCustomer, getProfile)
router.put('/profile', protectCustomer, updateProfile)
router.post('/change-password', protectCustomer, changePassword)
router.post('/addresses', protectCustomer, addAddress)
router.delete('/addresses/:addressIndex', protectCustomer, deleteAddress)
router.get('/orders', protectCustomer, getOrderHistory)

export default router
