import pool from '../db/db.js'

export async function getAllMuseums() {
  const res = await pool.query(`SELECT * FROM museums`)
  return res.rows
}

export async function getMuseumById(id) {
  const res = await pool.query(
    `
      SELECT * FROM museums
      WHERE id = $1
    `, [id]
  )

  return res.rows[0] || null
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
