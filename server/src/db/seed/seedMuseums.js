import fetch from 'node-fetch'
import pool from '../db.js'

async function seedMuseums() {
  const query = "SELECT%20%3Fmuseum%20%3Fname%20%3Fcity%20%3Fcountry%20%3Fimage%0AWHERE%20%7B%0A%20%20VALUES%20%3Fmuseum%20%7B%0A%20%20%20%20wd%3AQ160236%20%20%20%23%20The%20Metropolitan%20Museum%20of%20Art%0A%20%20%20%20wd%3AQ239303%20%20%20%23%20Art%20Institute%20of%20Chicago%0A%20%20%20%20wd%3AQ19675%20%20%20%20%23%20Louvre%0A%20%20%20%20wd%3AQ18600%20%20%20%20%23%20Tate%20Modern%0A%20%20%20%20wd%3AQ188740%20%20%20%23%20MoMA%0A%20%20%20%20wd%3AQ51252%20%20%20%20%23%20Uffizi%0A%20%20%20%20wd%3AQ160112%20%20%20%23%20Prado%0A%20%20%20%20wd%3AQ190804%20%20%20%23%20Rijksmuseum%0A%20%20%20%20wd%3AQ6373%20%20%20%20%20%23%20British%20Museum%0A%20%20%20%20wd%3AQ49133%20%20%20%20%23%20Smithsonian%0A%20%20%20%20wd%3AQ217%20%20%20%20%09%20%23%20Hermitage%20Museum%0A%20%20%20%20wd%3AQ154568%20%20%20%23%20Mus%C3%A9e%20d'Orsay%0A%20%20%20%20wd%3AQ1142686%20%20%23%20National%20Gallery%20(London)%0A%20%20%20%20wd%3AQ214867%20%20%20%23%20Gem%C3%A4ldegalerie%0A%20%20%20%20wd%3AQ23413%20%20%20%20%23%20Castle%20Howard%0A%20%20%20%20wd%3AQ731126%20%20%20%23%20Guggenheim%20Bilbao%0A%20%20%20%20wd%3AQ311022%20%20%20%23%20Whitney%20Museum%0A%20%20%20%20wd%3AQ334626%20%20%20%23%20Art%20Gallery%20of%20Ontario%0A%20%20%20%20wd%3AQ1251889%20%20%23%20National%20Museum%20of%20Anthropology%20(Mexico%20City)%0A%20%20%20%20wd%3AQ1330546%20%20%23%20Tokyo%20National%20Museum%0A%20%20%7D%0A%0A%20%20%3Fmuseum%20rdfs%3Alabel%20%3Fname%20.%0A%20%20FILTER(LANG(%3Fname)%20%3D%20%22en%22)%0A%0A%20%20%3Fmuseum%20wdt%3AP131%20%3FcityEntity%20.%0A%20%20%3FcityEntity%20rdfs%3Alabel%20%3Fcity%20.%0A%20%20FILTER(LANG(%3Fcity)%20%3D%20%22en%22)%0A%0A%20%20%3Fmuseum%20wdt%3AP17%20%3FcountryEntity%20.%0A%20%20%3FcountryEntity%20rdfs%3Alabel%20%3Fcountry%20.%0A%20%20FILTER(LANG(%3Fcountry)%20%3D%20%22en%22)%0A%0A%20%20OPTIONAL%20%7B%20%3Fmuseum%20wdt%3AP18%20%3Fimage%20%7D%0A%7D"

  const url = `https://query.wikidata.org/sparql?query=${query}`

  const res = await fetch(url,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/sparql-results+json'
      }
    }
  )

  if (!res.ok) {
    return console.error ('Error fetching from Wikidata')
  }

  const museums = (await res.json()).results.bindings

  try {
    const values = []
    const placeholders = []
    let i = 0
  
    for (const museumObj of museums) {
      const name = museumObj.name.value
      const city = museumObj.city.value
      const country = museumObj.country.value
      const image_url = museumObj.image?.value ? museumObj.image.value : null
  
      if (!name || !city || !country) {
        continue
      }
  
      let ind = i * 4
      
      placeholders.push(
        `($${ind + 1}, $${ind + 2}, $${ind + 3}, $${ind + 4})`
      )
      
      values.push(name, city, country, image_url)
  
      i++
    }

    if (values.length === 0) {
      console.log('No museums to insert')
      return
    }

    await pool.query(
      `
        INSERT INTO museums (name, city, country, image_url)
        VALUES ${placeholders.join(',')}
        ON CONFLICT (name, city) DO NOTHING
      `, values
    )

    console.log(`Successfully seeded ${values.length / 4} museums`)
  } catch (err) {
    console.error('Error adding to database', err)
  } finally {
    pool.end()
  }
}

seedMuseums()