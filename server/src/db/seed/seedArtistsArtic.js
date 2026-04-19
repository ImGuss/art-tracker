import fetch from 'node-fetch'
import pool from '../db.js'

async function seedArtists() {

  let page = 1
  let seededArtists = 0
  const maxArtists = 500

  while (seededArtists < maxArtists) {
    const res = await fetch(
      `https://api.artic.edu/api/v1/artists?page=${page}&limit=100&fields=id,title,birth_date,death_date,description`
    )

    const data = await res.json()

    for (const artist of data.data) {
      // seed more popular artists
      if (!artist.description) continue

      const { title, birth_date, death_date, description, id } = artist

      await pool.query(`
        INSERT INTO artists (name, birth_year, death_year, description, artic_id)
        VALUES ($1, $2, $3, $4, $5)`,
        [title, birth_date, death_date, description, id]
      )
      seededArtists++
      if (seededArtists >= maxArtists) break
      console.log(`Seeded artists: ${seededArtists}`)
    }
    page++
  }
  console.log(`Seeded ${seededArtists} artists`)
}

seedArtists()