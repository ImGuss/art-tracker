import pool from '../db/db.js'

export async function getAllTags() {
  const res = await pool.query(
    `
      SELECT * FROM tags
      ORDER BY name ASC
    `
  )

  return res.rows
}

export async function getTagById(id) {
  const res = await pool.query(
    `
      SELECT
        t.id,
        t.name AS tag_name,
        COALESCE(JSON_AGG(
          json_build_object(
            'artwork_id', aw.id,
            'title', aw.title,
            'image_url', aw.image_url,
            'artist_name', a.name
        )) FILTER (WHERE aw.id IS NOT NULL), '[]') AS artworks
      FROM tags t
      LEFT JOIN artwork_tags awt ON awt.tag_id = t.id
      LEFT JOIN artworks aw ON awt.artwork_id = aw.id
      LEFT JOIN artists a ON aw.artist_id = a.id
      WHERE t.id = $1
      GROUP BY t.id, t.name
    `, [id]
  )

  return res.rows[0] || null
}