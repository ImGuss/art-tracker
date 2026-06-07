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

export async function getTagById(id, limit, offset) {
  const res = await pool.query(
    `
      WITH paginated_artworks AS (
        SELECT
          awt.tag_id,
          aw.id AS artwork_id,
          aw.title,
          aw.image_url,
          a.name AS artist_name
        FROM artwork_tags awt
        JOIN artworks aw ON awt.artwork_id = aw.id
        LEFT JOIN artists a ON aw.artist_id = a.id
        WHERE awt.tag_id = $1
        ORDER BY aw.id DESC
        LIMIT $2 OFFSET $3
      )
      SELECT
        t.id,
        t.name AS tag_name,
        COALESCE(JSON_AGG(
          json_build_object(
            'artwork_id', pa.artwork_id,
            'title', pa.title,
            'image_url', pa.image_url,
            'artist_name', pa.artist_name
        )) FILTER (WHERE pa.artwork_id IS NOT NULL), '[]') AS artworks
      FROM tags t
      LEFT JOIN paginated_artworks pa ON pa.tag_id = t.id
      WHERE t.id = $1
      GROUP BY t.id, t.name
    `, [id, limit, offset]
  )

  return res.rows[0] || null
}