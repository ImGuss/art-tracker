import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { createUser, findUserByEmail, findUserById } from '../models/userModel.js'
import { AppError } from '../utils/AppError.js'

const SALT_ROUNDS = 12

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
}

function signToken(userId) {
  return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

export async function register(req, res, next) {
  try {
    
    const {username, email, password} = req.body

    if (!username || !email || !password) {
      return next(new AppError('username, email, and password are required', 400))
    }

    const existing = await findUserByEmail(email)

    if (existing) {
      return next(new AppError('An account with that email already exists', 409))
    }
  
    const passHash = await bcrypt.hash(password, SALT_ROUNDS)
  
    const user = await createUser({username, email, passHash})

    const token = signToken(user.id)
    res.cookie('token', token, cookieOptions)

    res.status(201).json({user})

  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  const password = req.body.password


}