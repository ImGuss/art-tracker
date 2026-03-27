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
  const {username, email, password} = req.body
  
  try {

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
  const { email, password } = req.body

  try {
    
    if (!email || !password) {
      return next(new AppError('email and password are required', 400))
    }
  
    const user = await findUserByEmail(email)
  
    if (!user) {
      return next(new AppError('Invalid email or password', 401))
    }
  
    const match = await bcrypt.compare(password, user.password_hash)

    if (!match) {
      return next(new AppError('Invalid email or password', 401))
    }

    const token = signToken(user.id)
    res.cookie('token', token, cookieOptions)

    const { password_hash, ...safeUser} = user
    res.json({user: safeUser})

  } catch (err) {
    next(err)
  }
}

export async function logout(req, res, next) {
  res.clearCookie('token', cookieOptions)
  res.json({message: 'Logged out successfully'})
}