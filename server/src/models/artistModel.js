import pool from '../db/db.js'

import { AppError } from '../utils/AppError.js'

export async function getAllArtists() {
  try {
    const res = await pool.query(`SELECT * FROM artists`)

    return res.rows

  } catch (err) {
    throw err
  }
}

export async function getArtistById(id) {
  try { 
    const res = await pool.query(`
      SELECT * FROM artists
      WHERE id = $1  
    `, [id])

    return res.rows[0] || null

  } catch (err) {
    throw err
  }
}

export async function createNewArtist(body) {
  const { name, birthYear, deathYear, birthPlace, description } = body

  try {
    const query = await pool.query(
      `
        SELECT * FROM artists
        WHERE name = $1 AND birth_year = $2 AND death_year = $3
      `, [name, birthYear, deathYear]
    )
  
    if (query.rows.length > 0) {
      throw new AppError(`Artist already exists. id: ${query.rows[0].id}`, 409)
    } else {
      const res = await pool.query(
        `
          INSERT INTO artists (name, birth_year, death_year, birth_place, description)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
        [name, birthYear, deathYear, birthPlace, description]
      )

      return res.rows[0]
    }
    
  } catch (err) {
    throw err
  }
}