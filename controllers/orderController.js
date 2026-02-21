import Order from '../models/Order.js'
import { sendSuccess, sendError, catchAsync } from '../utils/errorHandler.js'
import { validateOrder } from '../utils/validation.js'

// GET all orders
export const getOrders = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  
  let query = {}
  if (status) {
    query.status = status
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const orders = await Order.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
  
  const total = await Order.countDocuments(query)
  
  sendSuccess(res, {
    orders,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    }
  })
})

// GET single order by ID
export const getOrderById = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id)
  
  if (!order) {
    return sendError(res, 'Order not found', 404)
  }
  
  sendSuccess(res, order)
})

// CREATE new order
export const createOrder = catchAsync(async (req, res) => {
  const { items, customer, total } = req.body
  
  // Validate order
  const validation = validateOrder({ items, customer, total })
  if (!validation.valid) {
    return sendError(res, 'Validation failed', 400, validation.errors)
  }
  
  const order = new Order({
    items,
    customer,
    total,
    status: 'pending',
    paymentStatus: 'pending'
  })
  
  await order.save()
  
  sendSuccess(res, order, 201, 'Order created successfully')
})

// UPDATE order status
export const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  
  if (!status || !validStatuses.includes(status)) {
    return sendError(res, `Status must be one of: ${validStatuses.join(', ')}`, 400)
  }
  
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )
  
  if (!order) {
    return sendError(res, 'Order not found', 404)
  }
  
  sendSuccess(res, order, 200, 'Order status updated successfully')
})

// UPDATE order details
export const updateOrder = catchAsync(async (req, res) => {
  const { id } = req.params
  const updates = req.body
  
  // Don't allow changing items or total directly
  delete updates.items
  delete updates.total
  
  const order = await Order.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  )
  
  if (!order) {
    return sendError(res, 'Order not found', 404)
  }
  
  sendSuccess(res, order, 200, 'Order updated successfully')
})

// DELETE order
export const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params
  
  const order = await Order.findByIdAndDelete(id)
  
  if (!order) {
    return sendError(res, 'Order not found', 404)
  }
  
  sendSuccess(res, null, 200, 'Order deleted successfully')
})

// GET order statistics
export const getOrderStats = catchAsync(async (req, res) => {
  const stats = {
    total: await Order.countDocuments(),
    pending: await Order.countDocuments({ status: 'pending' }),
    processing: await Order.countDocuments({ status: 'processing' }),
    shipped: await Order.countDocuments({ status: 'shipped' }),
    delivered: await Order.countDocuments({ status: 'delivered' }),
    cancelled: await Order.countDocuments({ status: 'cancelled' })
  }
  
  const revenue = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
  ])
  
  stats.revenue = revenue[0]?.totalRevenue || 0
  
  sendSuccess(res, stats)
})
