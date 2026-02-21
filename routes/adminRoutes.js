import express from 'express'
import { loginAdmin, verifyAdmin, logoutAdmin } from '../controllers/adminController.js'
import { protectAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', loginAdmin)
router.get('/verify', protectAdmin, verifyAdmin)
router.post('/logout', protectAdmin, logoutAdmin)

export default router
