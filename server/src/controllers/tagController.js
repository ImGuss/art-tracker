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

    if (isNaN(id)) {
      return next(new AppError('Invalid tag id', 400))
    }

    const tag = await getTagById(id)

    if (!tag) {
      return next(new AppError('Tag not found', 404))
    }

    res.json(tag)

  } catch (err) {
    next(err)
  }
}