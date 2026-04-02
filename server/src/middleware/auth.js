import jwt from 'jsonwebtoken'

import { AppError } from '../utils/AppError.js'
import { findUserById } from '../models/userModel.js'

export async function protect(req, res, next) {
  const token = req.cookies.token
  try {

    if (!token) {
      return next(new AppError('Must be logged in to perform that action', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const userId = decoded.userId

    const user = await findUserById(userId)

    if (!user) {
      return next(new AppError('Could not find user', 401))
    }

    req.user = user

    next()

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired, please log in again', 401))
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid session, please log in again', 401))
    }
    next(err)
  }
}