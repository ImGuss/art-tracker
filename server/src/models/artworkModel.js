import pool from '../db/db.js'

export async function getAllArtworks() {
  try {
    const res = await pool.query(`SELECT * FROM artworks`)

    return res.rows

  } catch (err) {
    console.error('Error fetching artists', err)
    throw err
  }
}

export async function getArtworkById(id) {
  try {
    const res = await pool.query(
      `
        SELECT * FROM artworks
        WHERE id = $1
      `, [id]
    )

    if (res.rows.length === 0) return null

    return res.rows[0]

  } catch (err) {
    console.error('Error fetching artwork', err)
    throw err
  }
}

export async function createNewArtwork(body) {
  const { title, artistId, yearCreated, medium, imageUrl } = body

  try {

    const res = await pool.query(
      `
        INSERT INTO artworks (title, artist_id, year_created, medium, image_url)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (title) DO NOTHING
        RETURNING *
      `, [title, artistId, yearCreated, medium, imageUrl]
    )

    return res.rows[0]

  } catch (err) {
    console.error('Error adding artwork to database: ', err)
    throw err
  }
}