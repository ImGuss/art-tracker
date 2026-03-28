import pool from '../db/db.js'

import { AppError } from '../utils/AppError.js'

export async function getAllArtists() {
  const res = await pool.query(`SELECT * FROM artists`)

  return res.rows
}

export async function getArtistById(id) {
  const res = await pool.query(`
    SELECT * FROM artists
    WHERE id = $1  
  `, [id])

  return res.rows[0] || null
}

export async function createNewArtist(body) {
  const { name, birth_year, death_year, birth_place, description } = body

  try {

    const query = await pool.query(
      `
        SELECT * FROM artists
        WHERE name = $1
        AND birth_year IS NOT DISTINCT FROM $2
        AND death_year IS NOT DISTINCT FROM $3
      `, [name, birth_year, death_year]
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
        [name, birth_year, death_year, birth_place, description]
      )

      return res.rows[0]
    }
    
  } catch (err) {
    throw err
  }
}