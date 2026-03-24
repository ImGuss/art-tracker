import { getAllArtworks, getArtworkById, createNewArtwork } from '../models/artworkModel.js'
import { AppError } from '../utils/appError.js'

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
      throw new AppError('Invalid Artwork ID', 400)
    }

    const artwork = await getArtworkById(id)

    if(!artwork) {
      throw new AppError(`Artwork id ${id} not found`, 404)
    }

    res.json(artwork)

  } catch (err) {
    next(err)
  }
}

export async function createArtwork(req, res, next) {
  try {

    const newArtwork = await createNewArtwork(req.body)

    res.status(201).json(newArtwork)

  } catch (err) {
    next(err)
  }
}