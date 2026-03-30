import express from 'express'

import { protect } from '../middleware/auth.js'

import { getMuseums, getMuseum, createMuseum } from '../controllers/museumController.js'

export const museumRouter = express.Router()

museumRouter.get('/', getMuseums)
museumRouter.get('/:id', getMuseum)

museumRouter.post('/', protect, createMuseum)