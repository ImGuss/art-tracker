import pool from '../db/db.js'

export async function getAllMuseums() {
  const res = await pool.query(`SELECT * FROM museums`)
  return res.rows
}

export async function getMuseumById(id) {
  const res = await pool.query(
    `
      SELECT
        m.*,
        COALESCE(JSON_AGG(
        json_build_object(
          'id', aw.id,
          'title', aw.title,
          'artist_id', a.id,
          'artist_name', a.name,
          'year_created', aw.year_created,
          'medium', aw.medium,
          'image_url', aw.image_url
        )) FILTER (WHERE aw.id IS NOT NULL), '[]') AS artworks
      FROM museums m
      LEFT JOIN artworks aw ON aw.museum_id = m.id
      LEFT JOIN artists a ON aw.artist_id = a.id
      WHERE m.id = $1
      GROUP BY m.id
    `, [id]
  )

  return res.rows[0] || null
}

export async function getArtworksByMuseumId(id, limit, offset, searchTerm) {
  let filter = ``
  let valuesArray

  if (searchTerm) {
    filter = 
    `
      AND (aw.title ILIKE $4 OR a.name ILIKE $4 OR aw.medium ILIKE $4)
    `
    valuesArray = [id, limit, offset, `%${searchTerm}%`]
  } else {
    valuesArray = [id, limit, offset]
  }

  const res = await pool.query(
    `
      SELECT DISTINCT ON (aw.id)
        aw.*,
        a.name AS artist_name
      FROM artworks aw
      LEFT JOIN artists a ON aw.artist_id = a.id
      WHERE aw.museum_id = $1
      ${filter}
      ORDER BY aw.id, a.id ASC
      LIMIT $2 OFFSET $3
    `, valuesArray
  )

  return res.rows
}

export async function createNewMuseum(body) {
  const { name, city, country, image_url } = body

  const res = await pool.query(
    `
      INSERT INTO museums (name, city, country, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, city, country, image_url]
  )

  return res.rows[0]
}
