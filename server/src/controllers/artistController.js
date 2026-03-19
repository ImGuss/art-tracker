import { createNewArtist, getAllArtists, getArtistById } from '../models/artistModel.js'

export async function getArtists(req, res) {
  const artists = await getAllArtists()
  res.json(artists)
}

export async function getArtist(req, res) {
  const { id } = req.params

  const artist = await getArtistById(id)
  res.json(artist)
}

export async function createArtist(req, res) {
  const newArtist = await createNewArtist(req.body)
  res.json(newArtist)
}