import { createNewArtist, getAllArtists, getArtistById } from '../models/artistModel.js'

import { AppError } from '../utils/appError.js'

export async function getArtists(req, res, next) {
  try {
    const artists = await getAllArtists()
  
    res.json(artists)
    
  } catch (err) {
    next(err)
  }
}

export async function getArtist(req, res, next) {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      throw new AppError('Invalid Artist ID', 400)
    }
  
    const artist = await getArtistById(id)
  
    if (!artist) {
      throw new AppError(`Artist ID ${id} not found`, 404)
    }
  
    res.json(artist)
    
  } catch (err) {
    next(err)
  }
}

export async function createArtist(req, res, next) {
  try {
    const newArtist = await createNewArtist(req.body)

    res.status(201).json(newArtist)
    
  } catch (err) {
    next(err)
  }
}