import fetch from 'node-fetch'
import pool from '../db.js'

async function updateArtists() {

  let values
  let artists

  const artistMap = new Map()

  try {
    const res = await pool.query(`SELECT id, name FROM artists`)

    artists = res.rows
  } catch (err) {
    console.error('Error fetching artists', err)
  }

  values = (artists.map(artist => `("${artist.name}"@en)`)).join(' ')

  


  const query = 
    `
      SELECT ?human ?name ?birthDate ?deathDate WHERE {
        VALUES (?name) { ${values} }
        ?human rdfs:label ?name .
        ?human wdt:P31 wd:Q5 .
        OPTIONAL { ?human wdt:P569 ?birthDate . }
        OPTIONAL { ?human wdt:P570 ?deathDate . }
      }
    `

  const url = `https://query.wikidata.org/sparql`

  const res = await fetch(url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(query)}`
    }
  )

  if (!res.ok) {
    return console.error('Error fetching from Wikidata', res)
  }

  const artistInfo = (await res.json()).results.bindings

  for (const artist of artistInfo) {

    if (!artist.birthDate) {
      continue
    }

    const name = artist.name.value
    const birth_year = artist.birthDate.value.substring(0, 4)
    const death_year = artist.deathDate?.value.substring(0, 4) || null

    if (artistMap.has(name)) {
      continue
    }

    artistMap.set(name, {birth_year, death_year})
  }

  console.log(`Updating ${artistMap.size} artists`)

  let amountUpdated = 0

  try {
    for (const artist of artists) {
      const date = artistMap.get(artist.name)

      if (!date) { continue }

      await pool.query(
        `
          UPDATE artists
          SET
            birth_year = $1,
            death_year = $2
          WHERE id = $3
        `, [date.birth_year, date.death_year, artist.id]
      )

      amountUpdated++
    }
  } catch (err) {
    console.error('Error updating artist', err)
  } finally {
    pool.end()
  }

  console.log(`Updated ${amountUpdated} artists`)
  
}

updateArtists()