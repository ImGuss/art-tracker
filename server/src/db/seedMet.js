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


    // changing back to ids.length, using 10 for testing
    for (let i = 0; i < 10; i += batchSize) {
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

    for (const [key, artwork] of artistMap) {
      const ind = i * 4

      placeholders.push(
        `($${ind + 1}, $${ind + 2}, $${ind + 3}, $${ind + 4})`
      )
  
      values.push(
        artwork.name,
        artwork.birth_year,
        artwork.death_year,
        artwork.met_reference_object_id
      )

      i++
    }

    if (values.length === 0) {
      console.log('⚠️ No artists to insert')
      return
    }

    const artists = await pool.query(
      `
      INSERT INTO artists (name, birth_year, death_year, met_reference_object_id)
      VALUES ${placeholders.join(",")}
      ON CONFLICT (name) DO NOTHING
      RETURNING *
      `, values
    )

    allArtists = artists.rows

    console.log(`✅ Seeded ${artistMap.size} artists`)
  } catch (err) {
    console.error('❌ Error adding to database', err)
  }

  try {
    const artistValues = []
    const artworkPlaceholders = []

    allArtists.forEach(artist => {

      const { id, name, birth_year, death_year } = artist

      const key = `${name}|${birth_year || ''}|${death_year || ''}`
      artistRefMap.set(key, id)
    })

    console.log(artistRefMap)

  } catch (err) {
    
  } finally {
    await pool.end()
  }

}

seedMet()