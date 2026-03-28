import pool from '../db/db.js'

export async function getAllArtworks() {
  const res = await pool.query(`SELECT * FROM artworks`)
  return res.rows
}

export async function getArtworkById(id) {
  const res = await pool.query(
    `
      SELECT * FROM artworks
      WHERE id = $1
    `, [id]
  )

  return res.rows[0] || null
}

export async function createNewArtwork(body) {
  const { title, artist_id, museum_id, year_created, medium, image_url } = body

  const res = await pool.query(
    `
      INSERT INTO artworks (title, artist_id, museum_id, year_created, medium, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, artist_id, museum_id, year_created, medium, image_url]
  )

  return res.rows[0]
}