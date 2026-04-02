import pool from '../db/db.js'

export async function getCollectionsByUser(userId) {
  const res = await pool.query(
    `
      SELECT * FROM collections
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]
  )

  return res.rows
}

export async function getCollectionById(id) {
  const res = await pool.query(
    `
      SELECT
        c.id,
        c.user_id,
        c.name,
        c.created_at,
        COALESCE(JSON_AGG(
          json_build_object(
            'title', aw.title,
            'image_url', aw.image_url,
            'artist_name', a.name
          )) FILTER (WHERE aw.id IS NOT NULL), '[]') AS items
      FROM collections c
      LEFT JOIN collection_items ci ON ci.collection_id = c.id
      LEFT JOIN artworks aw ON ci.artwork_id = aw.id
      LEFT JOIN artists a ON aw.artist_id = a.id
      WHERE c.id = $1
      GROUP BY c.id, c.user_id, c.name, c.created_at
    `, [id]
  )

  return res.rows[0] || null
}

export async function createNewCollection(userId, name) {
  const res = await pool.query(
    `
      INSERT INTO collections (user_id, name)
      VALUES ($1, $2)
      RETURNING *
    `, [userId, name]
  )

  return res.rows[0]
}

export async function deleteCollectionById(id) {
  const res = await pool.query(
    `
      DELETE FROM collections
      WHERE id = $1
      RETURNING *
    `, [id]
  )

  return res.rows[0] || null
}

export async function addNewItemToCollection(collectionId, artworkId) {
  const res = await pool.query(
    `
      INSERT INTO collection_items (collection_id, artwork_id)
      VALUES ($1, $2)
      RETURNING *
    `, [collectionId, artworkId]
  )
  
  return res.rows[0] || null
}

export async function removeItemFromCollection(collectionId, artworkId) {
  const res = await pool.query(
    `
      DELETE FROM collection_items
      WHERE collection_id = $1 AND artwork_id = $2
      RETURNING *
    `, [collectionId, artworkId]
  )

  return res.rows[0] || null
}

export async function toggleFavoriteItem(collectionId, artworkId) {
  const res = await pool.query(
    `
      UPDATE collection_items
      SET favorite = NOT favorite
      WHERE collection_id = $1 AND artwork_id = $2
      RETURNING *
    `, [collectionId, artworkId]
  )

  return res.rows[0] || null
}