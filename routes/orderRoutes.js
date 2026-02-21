import express from 'express'
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  getOrderStats
} from '../controllers/orderController.js'
import { protectAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/stats', getOrderStats)

// Customer can create orders
router.post('/', createOrder)

// Protected routes (admin only)
router.get('/', protectAdmin, getOrders)
router.get('/:id', protectAdmin, getOrderById)
router.put('/:id/status', protectAdmin, updateOrderStatus)
router.put('/:id', protectAdmin, updateOrder)
router.delete('/:id', protectAdmin, deleteOrder)

export default router