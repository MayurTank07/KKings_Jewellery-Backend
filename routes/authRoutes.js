import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

// ADMIN LOGIN
router.post('/login', (req, res) => {
  const { password } = req.body

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Invalid password' })
  }

  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({ success: true, token })
})

// VERIFY TOKEN
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    res.json({ valid: true })
  } catch {
    res.sendStatus(403)
  }
})

export default router