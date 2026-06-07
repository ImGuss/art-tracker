import { getAllTags, getTagById} from '../models/tagModel.js'

import { AppError } from '../utils/AppError.js'

export async function getTags(req, res, next) {
  try {
    
    const tags = await getAllTags()

    res.json(tags)

  } catch (err) {
    next(err)
  }
}

export async function getTag(req, res, next) {
  try {
    
    const id = Number(req.params.id)
    const limit = parseInt(req.query.limit, 10) || 20
    const offset = parseInt(req.query.offset, 10) || 0

    if (isNaN(id)) {
      return next(new AppError('Invalid tag id', 400))
    }

    const tag = await getTagById(id, limit, offset)

    if (!tag) {
      return next(new AppError('Tag not found', 404))
    }

    res.json(tag)

  } catch (err) {
    next(err)
  }
}