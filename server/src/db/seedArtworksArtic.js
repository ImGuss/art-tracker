import fetch from 'node-fetch'
import pool from './db.js'

async function seedArtworks() {
  const maxArtworksPerArtist = 10
  let allArtWorks = []

  const artists = await pool.query('SELECT * FROM artists')

  for (const artist of artists.rows) {
    try {
      console.log(`Processing ${artist.name}`)

      const res = await fetch(
        `https://api.artic.edu/api/v1/artworks/?artist_id=${artist.artic_id}&limit=100&fields=id,title,artist_id,date_display,medium_display,image_id`
      )

      if (!res.ok) {
        console.error(`❌ API error for ${artist.name}`)
        continue
      }

      const data = await res.json()

      let count = 0
  
      // next artist if no artist data returned
      if (!data || !data.data) continue

      for (const artwork of data.data) {
        if (count >= maxArtworksPerArtist) break
  
        // ensure correct artist
        if (Number(artwork.artist_id) !== Number(artist.artic_id)) continue
  
        // skip missing images
        if (!artwork.image_id) continue
  
        allArtWorks.push({
          title: artwork.title,
          artist_id: artist.id,
          year_created: artwork.date_display,
          medium: artwork.medium_display,
          image_url: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
          artic_id: artwork.id
        })
  
        count++
      }
      
    } catch (err) {
      console.error(`❌ Fetch failed for ${artist.name}: ${err.message}`)
      continue
    }

  }

  const values = []
  const placeholders = []

  allArtWorks.forEach((artWork, i) => {
    const ind = i * 6

    placeholders.push(
      `($${ind + 1}, $${ind + 2}, $${ind + 3}, $${ind + 4}, $${ind + 5}, $${ind + 6})`
    )
  
    values.push(
      artWork.title,
      artWork.artist_id,
      artWork.year_created,
      artWork.medium,
      artWork.image_url,
      artWork.artic_id
    )
  })

  // not my code                                        //
  const uniqueMap = new Map()                           //
  for (const art of allArtWorks) {                      //
    if (!uniqueMap.has(art.artic_id)) {                 //
      uniqueMap.set(art.artic_id, art)                  // not my code
    }                                                   //
  }                                                     //
  const uniqueArtworks = Array.from(uniqueMap.values()) //
  // not my code                                        //

  await pool.query(`
    INSERT INTO artworks (title, artist_id, year_created, medium, image_url, artic_id)
    VALUES ${placeholders.join(',')}
    ON CONFLICT (artic_id) DO NOTHING
    `, values)

  await pool.end()
  console.log(`Seeded ${allArtWorks.length} artworks`)
  console.log(`Unique by artic_id: ${uniqueArtworks.length}`)
}

seedArtworks().catch(err => {
  console.error(`❌ Fatal error: ${err.message}`)
})