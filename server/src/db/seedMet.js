import fetch from 'node-fetch'
import pool from './db.js'

export async function seedMet() {
  const allArtworks = []
  const artistMap = new Map()

  try {

    const res = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?q=%22%22&artistOrCulture=true&hasImages=true`
    )

    if (!res.ok) {
      throw new Error('❌ Error fetching Met API data')
    }
    const data = await res.json()
    const ids = data.objectIDs

    console.log(data)

    console.log(`Object IDs ${ids}`)


    const batchSize = 10

    // fetch each object's data
    for (let i = 0; i < ids.length; i += batchSize) {
      // delay between batches
      await new Promise(res => setTimeout(res, 1000))

      const batch = ids.slice(i, i + batchSize)

      const objects = await Promise.all(batch.map(async objectID => {  
        console.log(`ObjectID: ${objectID}`)
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)

        if (!response.ok) {
          console.error(`❌ Error fetching object ${objectID}`, await response.text())
          return null
        }
        return await response.json()
      }))

      allArtworks.push(...objects)
    }


    for (const artwork of allArtworks) {

      const { artistDisplayName, artistBeginDate, artistEndDate, objectID } = artwork

      if (!artistDisplayName) continue

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

  // try {
  //   const values = []
  //   const placeholders = []

  //   artistMap.forEach((artwork, i) => {
  //     const ind = i * 4

  //     placeholders.push(
  //       `($${ind + 1}, $${ind + 2}, $${ind + 3}, $${ind + 4})`
  //     )
  
  //     values.push(
  //       artwork.name,
  //       artwork.birth_year,
  //       artwork.death_year,
  //       artwork.met_reference_object_id
  //     )
  //   })

  //   await pool.query(
  //     `
  //     INSERT INTO artists (name, birth_year, death_year, met_reference_object_id)
  //     VALUES ${placeholders.join(',')}
  //     ON CONFLICT (name) DO NOTHING
  //     `, values
  //   )

  //   console.log(`✅ Seeded ${artistMap.length} artists`)
  // } catch (err) {
  //   console.error('❌ Error adding to database', err)
  // }
}

seedMet()