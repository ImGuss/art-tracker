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
      <ArtistCard
        key={artist.id}
        artist={artist}
      />
  ))

  return (
    <section className="artist-page">
      <h2>Artists</h2>

      <div className="artist-list">
        {artistElements}
      </div>
      { error && <p>{error}</p> }

      {
        hasMore ?
        <button
          className={`view-more-btn ${isLoading && 'disabled-btn'}`}
          disabled={isLoading}
          onClick={loadMore}
        >
          View More
        </button> : null
      }
      
    </section>
  )
}

export default ArtistsPage