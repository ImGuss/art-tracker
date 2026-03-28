import { getAllArtworks, getArtworkById, createNewArtwork } from '../models/artworkModel.js'
import { AppError } from '../utils/AppError.js'

export async function getArtworks(req, res, next) {
  try {

    const artworks = await getAllArtworks()

    res.json(artworks)

  } catch (err) {
    next(err)
  }
}

export async function getArtwork(req, res, next) {
  try {
  
    const id = Number(req.params.id)

    if (isNaN(id)) {
      return next(new AppError('Invalid Artwork ID', 400))
    }

    const artwork = await getArtworkById(id)

    if(!artwork) {
      return next(new AppError(`Artwork id ${id} not found`, 404))
    }

    res.json(artwork)

  } catch (err) {
    next(err)
  }
}

export async function createArtwork(req, res, next) {
  try {
  
    const { title, artist_id } = req.body

    if (!title || !artist_id) {
      return next(new AppError('Title and artist id are required', 400))
    }

    const newArtwork = await createNewArtwork(req.body)

    res.status(201).json(newArtwork)

  } catch (err) {
    if (err.code === '23503') {
      return next(new AppError('Referenced record does not exist', 400))
    }
    next(err)
  }
}