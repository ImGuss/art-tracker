import {
  getVisitsByUser,
  getVisitById,
  createNewVisit,
  deleteVisitById,
  addNewArtworkToVisit,
  removeArtworkFromVisit
} from '../models/visitModel.js'

import { AppError } from '../utils/AppError.js'

export async function getUserVisits(req, res, next) {
  try {
    
    const visits = await getVisitsByUser(req.user.id)

    res.json(visits)

  } catch (err) {
    next(err)
  }
}

export async function getVisit(req, res, next) {
  try {

    const id = Number(req.params.id)

    if (isNaN(id)) {
      return next(new AppError('Invalid visit id', 400))
    }

    const visit = await getVisitById(id)

    if (!visit) {
      return next(new AppError('Visit not found', 404))
    }

    if(visit.user_id !== req.user.id) {
      return next(new AppError('Not authorized to view this visit', 403))
    }

    res.json(visit)

  } catch (err) {
    next(err)
  }
}

export async function createVisit(req, res, next) {
  try {
    
    const userId = req.user.id
    const { museum_id, visit_date } = req.body

    if (!museum_id || !visit_date) {
      return next(new AppError('Museum id, and visit date are required', 400))
    }

    const visit = await createNewVisit(userId, museum_id, visit_date)

    return res.json(visit)

  } catch (err) {
    if (err.code === '23503') {
      return next(new AppError('Museum not found', 400))
    }
    if (err.code === '23505') {
      return next(new AppError('You already have a visit to this museum on that date', 409))
    }
    next(err)
  }
}

export async function deleteVisit(req, res, next) {
  try {
    
    const id = Number(req.params.id)

    if (isNaN(id)) {
      return next(new AppError('Invalid visit id', 400))
    }

    const visit = await getVisitById(id)

    if (!visit) {
      return next(new AppError('Visit not found', 404))
    }

    if (visit.user_id !== req.user.id) {
      return next(new AppError('Not authorized to delete this visit', 403))
    }

    const deletedVisit = await deleteVisitById(id)

    if (!deletedVisit) {
      return next(new AppError('Visit not found', 404))
    }

    res.json(deletedVisit)

  } catch (err) {
    next(err)
  }
}

export async function addArtworkToVisit(req, res, next) {
  try {
    
    const visitId = Number(req.params.id)
    const artworkId = Number(req.params.artworkId)

    if (isNaN(visitId) || isNaN(artworkId)) {
      return next(new AppError('Visit id and artwork id must be numbers', 400))
    }

    const visit = await getVisitById(visitId)

    if (!visit) {
      return next(new AppError('Visit not found', 404))
    }

    if (visit.user_id !== req.user.id) {
      return next(new AppError('Not authorized to add to this visit', 403))
    }

    const visitItem = await addNewArtworkToVisit(visitId, artworkId)

    res.json(visitItem)

  } catch (err) {
    if (err.code === '23503') {
      return next(new AppError('Artwork not found', 400))
    }
    if (err.code === '23505') {
      return next(new AppError('Artwork already added to this visit', 409))
    }
    next(err)
  }
}

export async function removeFromVisit(req, res, next) {
  try {
    
    const visitId = Number(req.params.id)
    const artworkId = Number(req.params.artworkId)

    if (isNaN(visitId) || isNaN(artworkId)) {
      return next(new AppError('Visit id and artwork id must be numbers', 400))
    }

    const visit = await getVisitById(visitId)

    if (!visit) {
      return next(new AppError('Visit not found', 404))
    }

    if (visit.user_id !== req.user.id) {
      return next(new AppError('Not authorized to delete from this visit', 403))
    }

    const deletedVisitItem = await removeArtworkFromVisit(visitId, artworkId)

    if (!deletedVisitItem) {
      return next(new AppError('Item not found in visit', 404))
    }

    res.json(deletedVisitItem)

  } catch (err) {
    next(err)
  }
}