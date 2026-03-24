import { createNewArtist, getAllArtists, getArtistById } from '../models/artistModel.js'

import { AppError } from '../utils/appError.js'

export async function getArtists(req, res, next) {
  try {
    const artists = await getAllArtists()
  
    if (!artists) {
      throw new AppError('No artists found', 404)
    }
  
    res.json(artists)
    
  } catch (err) {
    next(err)
  }
}

export async function getArtist(req, res, next) {
  try {
    const { id } = req.params
  
    const artist = await getArtistById(id)
  
    if (!artist) {
      throw new AppError(`Artist id ${id} not found`, 404)
    }
  
    res.json(artist)
    
  } catch (err) {
    next(err)
  }
}

export async function createArtist(req, res, next) {
  try {
    console.log(req.body)
    const newArtist = await createNewArtist(req.body)

    res.json(newArtist)
    
  } catch (err) {
    next(err)
  }
}