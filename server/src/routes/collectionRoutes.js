import express from 'express'

import { protect } from '../middleware/auth.js'

import {
  getUserCollections,
  getCollection,
  createCollection,
  deleteCollection,
  addItemToCollection,
  removeFromCollection,
  toggleFavorite
} from '../controllers/collectionController.js'

export const collectionRouter = express.Router()

collectionRouter.use(protect)

collectionRouter.get('/:id', getCollection)
collectionRouter.get('/', getUserCollections)


collectionRouter.post('/:id/items/:artworkId', addItemToCollection)
collectionRouter.post('/', createCollection)

collectionRouter.delete('/:id/items/:artworkId', removeFromCollection)
collectionRouter.delete('/:id', deleteCollection)

// collectionRouter.patch('/:id/items/:artworkId', toggleFavorite)