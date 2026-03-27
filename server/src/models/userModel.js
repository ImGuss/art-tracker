import pool from '../db/db.js'

export async function createUser(body, passHash) {
  const { username, email } = body
  try {
    const newUser = await pool.query(
      `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at 
      `, [username, email, passHash]
    )

    return newUser.rows[0]

  } catch (err) {
    console.error('Error creating user')
    throw err
  }
}

export async function findUserByEmail(email) {
  const user = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  )

  return user.rows[0] || null
}

export async function findUserById(id) {
  const user = await pool.query(
    `SELECT id, username, email, created_at
    FROM users WHERE id = $1`,
    [id]
  )

  return user.rows[0] || null
}