import express from 'express'

import { getArtwork, getArtworks, createArtwork } from '../controllers/artworkController.js'

export const artworkRouter = express.Router()

artworkRouter.get('/:id', getArtwork)
artworkRouter.get('/', getArtworks)

artworkRouter.post('/', createArtwork)