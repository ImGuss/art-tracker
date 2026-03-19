import express from 'express'

import { getArtist, getArtists, createArtist } from '../controllers/artistController.js'

export const artistRouter = express.Router()

artistRouter.get('/:id', getArtist)
artistRouter.get('/', getArtists)

artistRouter.post('/', createArtist)