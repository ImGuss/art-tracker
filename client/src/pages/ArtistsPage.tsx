import { useEffect, useState } from 'react'

import type { Artist } from '../types/artist'

import { getArtists } from '../api/artistApi'

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
          const res = await getArtists(limit, 0)

          if (res.length < limit) {
            setHasMore(false)
          }
    
          setArtists(res)
          setOffset(prevOffset => prevOffset + limit)
        } catch (err) {
          setError('Failed to load artists')
        }
      }

      fetchData()

  }, [])

  const loadMore = async () => {
    try {
      const res = await getArtists(limit, offset)

      if (res.length < limit) {
        setHasMore(false)
      }

      setArtists(prevArtists => [...prevArtists, ...res])
      setOffset(prevOffset => prevOffset + limit)
    } catch (err) {
      setError('Failed to load artists')
    }
  }

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