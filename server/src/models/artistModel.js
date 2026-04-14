import pool from '../db/db.js'

import { AppError } from '../utils/AppError.js'

export async function getAllArtists(limit, offset) {
  const res = await pool.query(
    `
      SELECT DISTINCT ON (a.id)
        a.*,
        aw.image_url AS example_artwork_url
      FROM artists a
      LEFT JOIN artworks aw ON aw.artist_id = a.id
      ORDER BY a.id, aw.id ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset]
  )

  return res.rows
}

export async function getArtistById(id) {
  const res = await pool.query(
    `
      SELECT
        a.*,
        COALESCE(JSON_AGG(
        json_build_object(
          'id', aw.id,
          'title', aw.title,
          'image_url', aw.image_url,
          'year_created', aw.year_created
        )) FILTER (WHERE aw.id IS NOT NULL), '[]') AS artworks
      FROM artists a
      LEFT JOIN artworks aw ON aw.artist_id = a.id
      WHERE a.id = $1
      GROUP BY a.id
    `
  , [id])

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