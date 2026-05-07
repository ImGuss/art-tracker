import {
  getAllMuseums,
  getMuseumById,
  getArtworksByMuseumId, 
  createNewMuseum
} from '../models/museumModel.js'
import { AppError } from '../utils/AppError.js'

export async function getMuseums(req, res, next) {
  try {

    const museums = await getAllMuseums()

    res.json(museums)
    
  } catch (err) {
    next(err)
  }
}

export async function getMuseum(req, res, next) {
  try {
    
    const id = Number(req.params.id)

    if (isNaN(id)) {
      return next(new AppError('Invalid museum id', 400))
    }

    const museum = await getMuseumById(id)

    if (!museum) {
      return next(new AppError(`Museum id ${id} not found`, 404))
    }

    res.json(museum)

  } catch (err) {
    next(err)
  }
}

export async function getArtworksByMuseum(req, res, next) {
  try {
    
    const id = Number(req.params.id)

    const limit = parseInt(req.query.limit, 10) || 5
    const offset = parseInt(req.query.offset, 10) || 0
    const searchTerm = req.query.q

    if (isNaN(id)) {
      return next(new AppError('Invalid museum id', 400))
    }

    const museumArtworks = await getArtworksByMuseumId(id, limit, offset, searchTerm)

    return res.json(museumArtworks)

  } catch (err) {
    next(err)
  }
}

export async function createMuseum(req, res, next) {
  try {

    const { name, city, country} = req.body

    if (!name || !city || !country) {
      return next(new AppError('Name, city, and country are required', 400))
    }

    const newMuseum = await createNewMuseum(req.body)

    res.status(201).json(newMuseum)

  } catch (err) {
    if (err.code === '23505') {
      return next(new AppError('A museum with that name already exists in that city', 400))
    }
    next(err)
  }
}