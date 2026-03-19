import pool from '../db/db.js'

export async function getAllArtists() {
  try {

    const res = await pool.query(`SELECT * FROM artists`)
    console.table(res.rows)

    return res.rows

  } catch (err) {
    console.error('Error fetching artists', err)
  }
}

export async function getArtistById(id) {
  try {
    
    const res = await pool.query(`
      SELECT * FROM artists
      WHERE id = $1  
    `, [id])

    return res.rows

  } catch (err) {
    console.error('Error fetching artist', err)
  }
}

export async function createNewArtist(body) {
  const { name, birthDate, deathDate, placeOfBirth, description } = body
}