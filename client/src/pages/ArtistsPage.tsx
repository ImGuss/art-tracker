import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

interface Artist {
  id: number,
  name: string,
  birth_year: number | null,
  death_year: number | null,
  birth_place: string | null,
  description: string | null
}

const ArtistsPage = () => {

  const [artists, setArtists] = useState<Artist[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axiosInstance.get<Artist[]>('/artists')
    
          setArtists(res.data)
        } catch (err) {
          setError('Failed to load artists') 
        }
      }

      fetchData()

  }, [])

  const artistElements = artists.map(artist => (
      <div key={artist.id} >{artist.name}</div>
  ))

  return (
    <div>
      Artists Page
      {artistElements}
      { error && <p>{error}</p> }
    </div>
  )
}

export default ArtistsPage