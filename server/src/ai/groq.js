import Groq from 'groq-sdk'
import 'dotenv/config'

const groq = new Groq()

export async function generateDescription(artist) {
  const birth_year = artist.birth_year ? `, who was born in ${artist.birth_year}` : ''
  const death_year = artist.death_year ? ` and died in ${artist.death_year}` : ''
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_completion_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `You are writing artist biographies for an art tracking app. Write a short biographical paragraph (2-3 sentences) about the artist ${artist.name}${birth_year}${death_year}. Be factual and concise. If you are not confident about specific details, keep the description general.`
      }
    ]
  })

  return completion.choices[0].message.content
}

export async function generateDescriptionWithContext(artist) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_completion_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `You are writing artist biographies for an art tracking app. Write a short biographical paragraph (2-3 sentences) about the artist ${artist.name}. Here is some context: ${artist.description}. Be factual, concise, and do not invent specific details not supported by the context.`
      }
    ]
  })

  return completion.choices[0].message.content
}