import pool from '../db/db.js'

export async function getVisitsByUser(userId) {
  const res = await pool.query(
    `
      SELECT * FROM visits
      WHERE user_id = $1
      ORDER BY visit_date DESC
    `, [userId]
  )

  return res.rows
}

export async function getVisitById(visitId) {
  const res = await pool.query(
    `
      SELECT
        v.id,
        v.user_id,
        v.visit_date,
        m.id AS museum_id,
        m.name AS museum_name,
        COALESCE(JSON_AGG(
          json_build_object(
            'artwork_id', aw.id,
            'title', aw.title,
            'image_url', aw.image_url,
            'artist_name', a.name
        )) FILTER (WHERE aw.id IS NOT NULL), '[]' ) AS items
      FROM visits v
      LEFT JOIN visit_artworks va ON va.visit_id = v.id
      LEFT JOIN artworks aw ON va.artwork_id = aw.id
      LEFT JOIN artists a ON aw.artist_id = a.id
      LEFT JOIN museums m ON v.museum_id = m.id
      WHERE v.id = $1
      GROUP BY v.id, v.user_id, v.visit_date, m.id, m.name
    `, [visitId]
  )

  return res.rows[0] || null
}

export async function createNewVisit(user_id, museum_id, visit_date) {
  const res = await pool.query(
    `
      INSERT INTO visits (user_id, museum_id, visit_date)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [user_id, museum_id, visit_date]
  )

  return res.rows[0] || null
}

export async function deleteVisitById(visitId) {
  const res = await pool.query(
    `
      DELETE FROM visits
      WHERE id = $1
      RETURNING *
    `, [visitId]
  )

  return res.rows[0] || null
}

export async function addNewArtworkToVisit(visitId, artworkId) {
  const res = await pool.query(
    `
      INSERT INTO visit_artworks (visit_id, artwork_id)
      VALUES ($1, $2)
      RETURNING *
    `, [visitId, artworkId]
  )

  return res.rows[0] || null
}

export async function removeArtworkFromVisit(visitId, artworkId) {
  const res = await pool.query(
    `
      DELETE FROM visit_artworks
      WHERE visit_id = $1 AND artwork_id = $2
      RETURNING *
    `, [visitId, artworkId]
  )

  return res.rows[0] || null
}