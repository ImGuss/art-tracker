import express from 'express'

import { protect } from '../middleware/auth.js'

import { getMuseums, getMuseum, getArtworksByMuseum, createMuseum } from '../controllers/museumController.js'

export const museumRouter = express.Router()

museumRouter.get('/:id/artworks', getArtworksByMuseum)
museumRouter.get('/:id', getMuseum)
museumRouter.get('/', getMuseums)

museumRouter.post('/', protect, createMuseum)