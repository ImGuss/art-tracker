import pool from '../db/db.js'

export async function getAllArtworks(limit, offset, searchTerm) {

  let filter = ``
  let valuesArray

  if (searchTerm) {
    filter =  `WHERE aw.title ILIKE $3`
    valuesArray = [limit, offset, `%${searchTerm}%`]
  } else {
    valuesArray = [limit, offset]
  }

  const res = await pool.query(
    `
      SELECT
        aw.*,
        a.name AS artist_name
      FROM artworks aw
      LEFT JOIN artists a ON aw.artist_id = a.id
      ${filter}
      ORDER BY a.id, aw.id
      LIMIT $1 OFFSET $2
    `, valuesArray
  )
  return res.rows
}

export async function getArtworkById(id) {
  const res = await pool.query(
    `
      SELECT
        aw.*,
        a.name AS artist_name,
        m.name AS museum_name,
        ARRAY_REMOVE(ARRAY_AGG(t.name), NULL) AS tags
      FROM artworks aw
      LEFT JOIN artwork_tags awt ON awt.artwork_id = aw.id
      LEFT JOIN tags t ON awt.tag_id = t.id
      LEFT JOIN artists a ON aw.artist_id = a.id
      LEFT JOIN museums m ON aw.museum_id = m.id
      WHERE aw.id = $1
      GROUP BY aw.id, a.name, m.name
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