import fetch from 'node-fetch'
import pool from './db.js'

export async function seedMet() {
  const allArtworks = []
  const artistMap = new Map()
  let allArtists
  const artistRefMap = new Map()

  try {

    const res = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?q=%22%22&artistOrCulture=true&hasImages=true`
    )

    if (!res.ok) {
      throw new Error('❌ Error fetching Met API data')
    }
    const data = await res.json()
    const ids = data.objectIDs

    const batchSize = 10

    // fetch each object's data
    for (let i = 0; i < ids.length; i += batchSize) {
      // cooldown to avoid bot detector
      if (i % 20 === 0 && i > 0) {
        console.log('⏸️ Pausing to avoid API limits')
        const batchDelay = 1000 + Math.random() * 1500
        await new Promise(res => setTimeout(res, batchDelay))
      }

      const batch = ids.slice(i, i + batchSize)

      for (const objectID of batch) {
      // delay between fetches
      const delay = 200 + Math.random() * 300
      await new Promise(res => setTimeout(res, delay))

        console.log(`ObjectID: ${objectID}`)
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)

        const text = await response.text()

        if (!response.ok || text.includes('Incapsula')) {
          if (text.includes('Incapsula')) {
            // pause if API limit reached
            console.warn('⚠️ Hit the API limit. Pausing for 10 seconds')
            await new Promise(res => setTimeout(res, 10000))
            continue
          } else {
            console.error(`❌ Error fetching object ${objectID}`, text)
            continue
          }
        }
        try {
          const parsed = JSON.parse(text)
          allArtworks.push(parsed)
        } catch (err) {
          console.error(`Failed to parse JSON for ${objectID}`, err)
        }
      }
    }


    for (const artwork of allArtworks) {

      if (!artwork.artistDisplayName || !artwork.artistBeginDate) continue
      const { artistDisplayName, artistBeginDate, artistEndDate, objectID } = artwork


      const key = `${artistDisplayName}|${artistBeginDate || ''}|${artistEndDate || ''}`
      // deduplicate artists
      if (!artistMap.has(key)) {
        artistMap.set(key, {
          name: artistDisplayName,
          birth_year: artistBeginDate || null,
          death_year: artistEndDate || null,
          met_reference_object_id: objectID
        })
      }
    }

  } catch (err) {
    console.error('❌ Error in fetch pipeline', err)
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
        artist.met_reference_object_id
      )

      i++
    }

    if (values.length === 0) {
      console.log('⚠️ No artists to insert')
      return
    }

    await pool.query(
      `
      INSERT INTO artists (name, birth_year, death_year, met_reference_object_id)
      VALUES ${placeholders.join(",")}
      ON CONFLICT (name) DO NOTHING
      `, values
    )

    const artists = await pool.query(
      `SELECT id, name, birth_year, death_year FROM artists`
    )

    allArtists = artists.rows

    console.log(`✅ Seeded ${artistMap.size} artists`)
  } catch (err) {
    console.error('❌ Error adding to database', err)
  }

  try {
    const artworkValues = []
    const artworkPlaceholders = []

    allArtists.forEach(artist => {

      const { id, name, birth_year, death_year } = artist

      const artistKey = `${name}|${birth_year || ''}|${death_year || ''}`
      artistRefMap.set(artistKey, id)
    })

    let i = 0
    
    for (const artwork of allArtworks) {
      const { title, objectEndDate, medium, primaryImageSmall, objectID, artistDisplayName, artistBeginDate, artistEndDate  } = artwork
      
      if (!title || !primaryImageSmall) continue
      
      // match artwork to artist
      const artworkKey = `${artistDisplayName}|${artistBeginDate || ''}|${artistEndDate || ''}`
      const artistID = artistRefMap.get(artworkKey)
      
      if (!artistID) {
        console.warn(`⚠️ Missing artist for: ${artistDisplayName}`)
        continue
      }
      
      const ind = i * 6

      artworkPlaceholders.push(
        `($${ind + 1}, $${ind + 2}, $${ind + 3}, $${ind + 4}, $${ind + 5}, $${ind + 6})`
      )
      
      
      artworkValues.push(
        title,
        artistID,
        objectEndDate,
        medium,
        primaryImageSmall,
        objectID,
      )
      
      i++
    }

    if (artworkValues.length === 0) {
      console.log('⚠️ No artwork to insert')
      return

    }


    await pool.query(
      `
        INSERT INTO artworks (title, artist_id, year_created, medium, image_url, met_id)
        VALUES ${artworkPlaceholders.join(",")}
        ON CONFLICT (met_id) DO NOTHING
      `, artworkValues
    )
      
  } catch (err) {
    console.error('❌ Error adding to database', err)
  } finally {
    pool.end()
  }

}

seedMet()