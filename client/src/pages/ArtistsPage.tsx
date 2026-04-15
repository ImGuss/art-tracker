import { useEffect, useState } from 'react'

import type { Artist } from '../types/artist'

import { getArtists } from '../api/artistApi'

import './ArtistPage.css'

//components
import ArtistCard from '../components/ArtistCard'

const ArtistsPage = () => {

  // state values
  const [artists, setArtists] = useState<Artist[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  // const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const limit = 20

  useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true)
          const res = await getArtists(limit, 0)

          if (res.length < limit) {
            setHasMore(false)
          }
    
          setArtists(res)
          setOffset(prevOffset => prevOffset + limit)
        } catch (err) {
          setError('Failed to load artists')
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()

  }, [])

  const loadMore = async () => {
    try {
      setIsLoading(true)
      const res = await getArtists(limit, offset)

      if (res.length < limit) {
        setHasMore(false)
      }

      setArtists(prevArtists => [...prevArtists, ...res])
      setOffset(prevOffset => prevOffset + limit)
    } catch (err) {
      setError('Failed to load artists')
    } finally {
      setIsLoading(false)
    }
  }

  const artistElements = artists.map(artist => (
      <div key={artist.id} >{artist.name}</div>
  ))

  const firstArtist = artists[0]

  return (
    <div>
      Artists Page
      {artistElements}
      {artists.length > 0 ? 
        <ArtistCard
          artist={firstArtist}
        /> : null
      }
      { error && <p>{error}</p> }
    </div>
  )
}

export default ArtistsPage