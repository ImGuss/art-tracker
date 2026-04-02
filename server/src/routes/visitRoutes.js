import express from 'express'

import { protect } from '../middleware/auth.js'

import {
  getUserVisits,
  getVisit,
  createVisit,
  deleteVisit,
  addArtworkToVisit,
  removeFromVisit
} from '../controllers/visitController.js'

export const visitRouter = express.Router()

visitRouter.use(protect)

visitRouter.get('/:id', getVisit)
visitRouter.get('/', getUserVisits)

visitRouter.post('/:id/artworks/:artworkId', addArtworkToVisit)
visitRouter.post('/', createVisit)

visitRouter.delete('/:id/artworks/:artworkId', removeFromVisit)
visitRouter.delete('/:id', deleteVisit)