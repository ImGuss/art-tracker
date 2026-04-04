import express from 'express'

import { protect } from '../middleware/auth.js'

import { register, login, getMe, logout } from '../controllers/authController.js'

export const authRouter = express.Router()

authRouter.get('/me', protect, getMe)

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)