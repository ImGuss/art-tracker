import { 
  getCollectionsByUser,
  getCollectionById,
  createNewCollection,
  deleteCollectionById,
  addNewItemToCollection,
  removeItemFromCollection,
  toggleFavorite
} from '../models/collectionModel.js'

import { AppError } from '../utils/AppError.js'

export async function getUserCollections(req, res, next) {
  try {
    
    const collections = await getCollectionsByUser(req.user.id)

    res.json(collections)

  } catch (err) {
    next(err)
  }
}

export async function getCollection(req, res, next) {
  try {
    
    const id = Number(req.params.id)

    if (isNaN(id)) {
      return next(new AppError('Invalid collection id', 400))
    }

    const collection = await getCollectionById(id)

    if (!collection) {
      return next(new AppError('Collection not found', 404))
    }

    if(collection.user_id !== req.user.id) {
      return next(new AppError('Not authorized to view this collection', 403))
    }

    res.json(collection)
    
  } catch (err) {
    next(err)
  }
}

export async function createCollection(req, res, next) {
  try {
    
    const userId = req.user.id
    const name = req.body.name

    if (!name) {
      return next(new AppError('Name is required', 400))
    }

    const collection = await createNewCollection(userId, name)

    return res.json(collection)

  } catch (err) {
    next(err)
  }
}

export async function deleteCollection(req, res, next) {
  try {
    
    const id = Number(req.params.id)

    if (isNaN(id)) {
      return next(new AppError('Invalid collection id', 400))
    }

    const collection = await getCollectionById(id)

    if (!collection) {
      return next(new AppError('Collection not found', 404))
    }

    if (collection.user_id !== req.user.id) {
      return next(new AppError('Not authorized to delete this collection', 403))
    }

    const deletedCollection = await deleteCollectionById(id)

    if (!deletedCollection) {
      return next(new AppError('Collection not found', 404))
    }

    res.json(deletedCollection)

  } catch (err) {
    next(err)
  }
}

export async function addItemToCollection(req, res, next) {
  try {
    
    const collectionId = Number(req.params.collectionId)
    const artworkId = Number(req.params.artworkId)

    if (isNaN(collectionId) || isNaN(artworkId)) {
      return next(new AppError('Collection id and artwork id must be numbers', 400))
    }

    const collection = await getCollectionById(collectionId)

    if (!collection) {
      return next(new AppError('Collection not found', 404))
    }

    if (collection.user_id !== req.user.id) {
      return next(new AppError('Not authorized to add to this collection', 403))
    }

    const collectionItem = await addNewItemToCollection(collectionId, artworkId)

    res.json(collectionItem)

  } catch (err) {
    if (err.code === '23505') {
      return next(new AppError('That artwork is already in this collection', 400))
    }
    if (err.code === '23503') {
      return next( new AppError('Artwork not found', 404))
    }
    next(err)
  }
}

export async function removeFromCollection(req, res, next) {
  try {
    
    const collectionId = Number(req.params.collectionId)
    const artworkId = Number(req.params.artworkId)

    if (isNaN(collectionId) || isNaN(artworkId)) {
      return next(new AppError('Collection id and artwork id must be numbers', 400))
    }

    const collection = await getCollectionById(collectionId)

    if (!collection) {
      return next(new AppError('Collection not found', 404))
    }

    if (collection.user_id !== req.user.id) {
      return next(new AppError('Not authorized to delete from this collection', 403))
    }

    const deletedCollectionItem = await removeItemFromCollection(collectionId, artworkId)

    if (!deletedCollectionItem) {
      return next(new AppError('Item not found in collection', 404))
    }

    res.json(deletedCollectionItem)

  } catch (err) {
    next(err)
  }
}

export async function toggleFavorite(req, res, next) {
  // still to do
}