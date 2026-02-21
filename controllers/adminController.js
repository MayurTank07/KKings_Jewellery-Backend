import jwt from 'jsonwebtoken'
import { sendSuccess, sendError, catchAsync } from '../utils/errorHandler.js'

// 🔐 Admin password from .env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456'

// ======================
// 🔐 LOGIN ADMIN
// ======================
export const loginAdmin = catchAsync(async (req, res) => {
  const { password } = req.body

  if (!password) {
    return sendError(res, 'Password is required', 400)
  }

  // ❌ Wrong password
  if (password !== ADMIN_PASSWORD) {
    console.log('❌ Admin login failed')
    return sendError(res, 'Invalid password', 401)
  }

  // ✅ Generate token
  const token = jwt.sign(
    {
      role: 'admin',
      loginTime: Date.now()
    },
    process.env.JWT_SECRET || 'jwt_secret',
    { expiresIn: '7d' }
  )

  console.log('✅ Admin login success')

  sendSuccess(res, { token }, 200, 'Login successful')
})


// ======================
// 🔍 VERIFY ADMIN TOKEN
// ======================
export const verifyAdmin = catchAsync(async (req, res) => {
  // ✅ Extra safety check
  if (req.admin?.role !== 'admin') {
    return sendError(res, 'Not authorized as admin', 403)
  }

  sendSuccess(res, { valid: true }, 200, 'Token is valid')
})


// ======================
// 🚪 LOGOUT ADMIN
// ======================
export const logoutAdmin = catchAsync(async (req, res) => {
  // Optional: future token blacklist logic
  sendSuccess(res, null, 200, 'Logout successful')
})