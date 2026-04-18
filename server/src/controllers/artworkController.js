import { getAllArtworks, getArtworkById, createNewArtwork } from '../models/artworkModel.js'
import { AppError } from '../utils/AppError.js'

export async function getArtworks(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 20
    const offset = parseInt(req.query.offset, 10) || 0

    const artworks = await getAllArtworks(limit, offset)

    res.json(artworks)

  } catch (err) {
    next(err)
  }
}

export async function getArtwork(req, res, next) {
  try {
  
    const id = Number(req.params.id)

    if (isNaN(id)) {
      return next(new AppError('Invalid artwork id', 400))
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