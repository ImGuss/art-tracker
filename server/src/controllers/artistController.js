import { createNewArtist, getAllArtists, getArtistById } from '../models/artistModel.js'

export async function getArtists(req, res) {
  try {
    const artists = await getAllArtists()
  
    if (!artists) {
      return res.status(404).json({error: 'No artists found'})
    }
  
    res.json(artists)
    
  } catch (err) {
    next(err)
  }
}

export async function getArtist(req, res) {
  try {
    const { id } = req.params
  
    const artist = await getArtistById(id)
  
    if (!artist) {
      return res.status(404).json({error: 'Artist not found'})
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