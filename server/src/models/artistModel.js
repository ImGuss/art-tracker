import pool from '../db/db.js'

export async function getAllArtists() {
  try {
    const res = await pool.query(`SELECT * FROM artists`)

    if (res.rows.length === 0) null

    return res.rows

  } catch (err) {
    console.error('Error fetching artists', err)
    throw err
  }
}

export async function getArtistById(id) {
  try { 
    const res = await pool.query(`
      SELECT * FROM artists
      WHERE id = $1  
    `, [id])

    if (res.rows.length === 0) null

    return res.rows[0]

  } catch (err) {
    console.error('Error fetching artist', err)
    throw err
  }
}

export async function createNewArtist(body) {
  const { name, birthYear, deathYear, placeOfBirth, description } = body

  try {
    const query = await pool.query(
      `
        SELECT * FROM artists
        WHERE name = $1 AND birth_year = $2 AND death_year = $3
      `, [name, birthYear, deathYear]
    )
  
    if (query.rows.length > 0) {
      const error = new Error()
      error.message = 'Artist already exists'
      error.status = 409
      throw error
    } else {
      const res = await pool.query(
        `
          INSERT INTO artists (name, birth_year, death_year, birth_place, description)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
        [name, birthYear, deathYear, placeOfBirth, description]
      )
    }
    
  } catch (err) {
    console.error('Error adding artist to database', err)
    throw err
  }
}