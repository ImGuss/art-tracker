import { createNewArtist, getAllArtists, getArtistById } from '../models/artistModel.js'

import { AppError } from '../utils/AppError.js'

export async function getArtists(req, res, next) {
  try {

    const limit = parseInt(req.query.limit, 10) || 20
    const offset = parseInt(req.query.offset, 10) || 0
    const searchTerm = req.query.q

    const artists = await getAllArtists(limit, offset, searchTerm)
  
    res.json(artists)
    
  } catch (err) {
    next(err)
  }
}

export async function getArtist(req, res, next) {
  try {

    const id = Number(req.params.id)

    if (isNaN(id)) {
      return next(new AppError('Invalid Artist ID', 400))
    }
  
    const artist = await getArtistById(id)
  
    if (!artist) {
      return next(new AppError(`Artist ID ${id} not found`, 404))
    }
  
    res.json(artist)
    
  } catch (err) {
    next(err)
  }
}

export async function createArtist(req, res, next) {
  try {
  
    const { name } = req.body
    
    if (!name) {
      return next(new AppError('Artist name is required', 400))
    }

    const newArtist = await createNewArtist(req.body)

    res.status(201).json(newArtist)
    
  } catch (err) {
    if (err.code === '23505') {
      return next(new AppError('That artist already exists', 409))
    }
    next(err)
  }
}