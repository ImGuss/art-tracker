import { useEffect, useState } from 'react'

import type { Artist } from '../types/artist'

import { getArtists } from '../api/artistApi'

import './ArtistPage.css'

// components
import ArtistCard from '../components/ArtistCard'
import AddArtistForm from '../components/AddArtistForm'
import Modal from '../components/Modal'

const ArtistsPage = () => {

  // state values
  const [artists, setArtists] = useState<Artist[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const limit = 20

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await getArtists(limit, 0, undefined)

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
      const res = await getArtists(limit, offset, undefined)

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

  if (error) {
    return (
      <p className="error">{error}</p>
    )
  }

  const renderArtists = artists.map(artist => (
      <ArtistCard
        key={artist.id}
        artist={artist}
      />
  ))

  return (
    <section className="page">

    <Modal
      isOpen={isOpen}
      onClose={() => {setIsOpen(false)}}
      title="Add Artist"
    >
      <AddArtistForm />
    </Modal>

      <div className="page-header">
        <h2 className="page-title">Artists</h2>
        <button
          className="gold-btn"
          onClick={() => {setIsOpen(true)}}
        >
          Add Artist
        </button>
      </div>

      <div className="page-grid">
        {renderArtists}
      </div>

      {
        isLoading ?
        <div className="loading">Loading...</div> : null
      }

      {
        hasMore ?
        <button
          className={`view-more-btn ${isLoading ? 'disabled-btn' : ''}`}
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