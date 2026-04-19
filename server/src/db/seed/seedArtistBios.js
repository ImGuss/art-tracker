import fetch from 'node-fetch'
import pool from '../db.js'

import { generateDescription, generateDescriptionWithContext } from '../../ai/groq.js'

async function seedBios() {
  
  let artists

  const artistMap = new Map()
  const noBios = new Map()

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  try {
    const res = await pool.query(
      `
        SELECT id, name, birth_year, death_year
        FROM artists
      `
    )

    artists = res.rows
  } catch (err) {
    console.error('Error fetching artists', err)
    return
  }

  for (const artist of artists) {

    try {
      console.log(`fetching info for ${artist.name}`)
      const encodedName = encodeURIComponent(artist.name)

      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=extracts&exintro=true&explaintext=true&format=json`

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Docently/1.0 (imguss@gmail.com)'
        }
      })

      const data = await res.json()

      const pages = data.query.pages
      const artistInfo = Object.values(pages)[0]
      const description = artistInfo.extract

      if (
        !description ||
        description.length < 150 ||
        artistInfo.missing ||
        artistInfo.pageid === -1
      ) {
        noBios.set(artist.id, {
          name: artist.name,
          description: description ?? null,
          birth_year: artist.birth_year,
          death_year: artist.death_year
        })
        await sleep(500)
        continue
      }

      if (description.length > 1200) {
        const trimmedDescription = description.substring(0, 1200)
        artistMap.set(artist.id, {name: artist.name, description: trimmedDescription + '...'})
        await sleep(500)
        continue
      }

      artistMap.set(artist.id, {name: artist.name, description: description})


      await sleep(500)
    } catch (err) {
      console.error('failed to fetch artist from wiki api', err)
    }
  }

  console.log(`found ${artistMap.size} artist descriptions`)

  console.log(`need to generate ${noBios.size} descriptions`)

  for (const [id, artist] of noBios) {
    try {
      let aiDescription
      if (!artist.description) {
        aiDescription = await generateDescription(artist)
      } else {
        aiDescription = await generateDescriptionWithContext(artist)
      }

      artistMap.set(id, {
        name: artist.name,
        description: aiDescription + ' - [AI-generated]'
      })

      await sleep(500)
    } catch (err) {
      console.error('Error generating descriptions', err)
    }
  }

  for (const [id, artist] of artistMap) {
    try {
      await pool.query (
        `
          UPDATE artists
          SET description = $1
          WHERE id = $2
        `, [artist.description, id]
      )
    } catch (err) {
      console.error('Failed to update artist', err)
    }
  }

  await pool.end()

  console.log(`added ${artistMap.size} descriptions`)

}

seedBios()