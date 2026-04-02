import express from 'express'

import { getTags, getTag } from '../controllers/tagController.js'

export const tagRouter = express.Router()

tagRouter.get('/:id', getTag)
tagRouter.get('/', getTags)