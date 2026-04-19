import fetch from 'node-fetch'
import pool from '../db.js'

async function seedArtic() {

  let target = 500
  let page = 1
  const limit = 100
  let allArtWorks = []

  const artistMap = new Map()
  let allArtists
  const artistRefMap = new Map()

  const baseUrl = 'https://api.artic.edu/api/v1'

  while (allArtWorks.length < target) {

    const res = await fetch(
      `${baseUrl}/artworks?page=${page}&limit=${limit}&fields=id,title,artist_title,artist_id,date_display,medium_display,image_id,artist_display&is_public_domain=true`
    )

    const data = await res.json()

    for (const artwork of data.data) {
      if (!artwork.image_id || !artwork.title || !artwork.artist_title || !artwork.artist_id) {
        continue
      }

      allArtWorks.push(artwork)
    }

    if (data.pagination.next_url === null) {
      break
    }

    page++
  }

  allArtWorks = allArtWorks.slice(0, target)

  for (const artwork of allArtWorks) {
    const key = artwork.artist_id
    artistMap.set(key, {
      name: artwork.artist_title,
      birth_year: null,
      death_year: null,
      artic_id: artwork.artist_id
    })
  }

  try {
    const values = []
    const placeholders = []
    let i = 0
    
    for (const [key, artist] of artistMap) {
      const ind = i * 4
  
      placeholders.push(
        `($${ind + 1}, $${ind + 2}, $${ind + 3}, $${ind + 4})`
      )

      values.push(
        artist.name,
        artist.birth_year,
        artist.death_year,
        artist.artic_id
      )

      i++
    }

    if (values.length === 0) {
      console.log('No artists to insert')
      return
    }

    await pool.query(
      `
        INSERT INTO artists (name, birth_year, death_year, artic_id)
        VALUES ${placeholders.join(',')}
        ON CONFLICT (artic_id) DO NOTHING
      `, values
    )

    const artists = await pool.query(
      `SELECT id, name, birth_year, death_year, artic_id
      FROM artists
      WHERE artic_id IS NOT NULL`
    )

    allArtists = artists.rows

    console.log(`Seeded ${artists.rows.length} artists`)

  } catch (err) {
    console.error('Error adding to database', err)
  }

  try {
    const artworkValues = []
    const artworkPlaceholders = []
    let i = 0

    
    for (const artist of allArtists) {
      artistRefMap.set(artist.artic_id, artist.id)
    }
    
    for (const artwork of allArtWorks) {
      const { id, title, artist_id, date_display, medium_display, image_id} = artwork

      const artistId = artistRefMap.get(artist_id)

      if (!artistId) {
        console.warn(`Could not resolve artist_id ${artist_id} for artwork ${title}`)
        continue
      }

      const image_url = `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`

      const ind = i * 6

      artworkPlaceholders.push(
        `($${ind + 1}, $${ind + 2}, $${ind + 3}, $${ind + 4}, $${ind + 5}, $${ind + 6})`
      )

      artworkValues.push(title, artistId, date_display, medium_display, image_url, id)

      i++
    }

    if (artworkValues.length === 0) {
      console.log('No artworks to insert')
      return
    }

    await pool.query(
      `
        INSERT INTO artworks (title, artist_id, year_created, medium, image_url, artic_id)
        VALUES ${artworkPlaceholders.join(',')}
        ON CONFLICT (artic_id) DO NOTHING
      `, artworkValues
    )

  } catch (err) {
    console.error('Error adding to database', err)
  } finally {
    pool.end()
  }

}

seedArtic()