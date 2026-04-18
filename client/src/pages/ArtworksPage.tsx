import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import type { Artwork } from '../types/artwork'

import { getArtworks } from '../api/artworkApi'

import './ArtworksPage.css'

// components
import ArtworkCard from '../components/ArtworkCard'

const ArtworksPage = () => {

  // state values
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const limit = 20

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await getArtworks(limit, 0)

        if (res.length < limit) {
          setHasMore(false)
        }

        setArtworks(res)
        setOffset(prevOffset => prevOffset + limit)
      } catch (err) {
        setError('Failed to load artworks')
      } finally {
        setIsLoading(false)
      }

    }

    fetchData()
  }, [])

  const loadMore = async () => {
    try {
      setIsLoading(true)
      const res = await getArtworks(limit, offset)

      if (res.length < limit) {
        setHasMore(false)
      }

      setArtworks(prevArtworks => [...prevArtworks, ...res])
      setOffset(prevOffset => prevOffset + limit)
    } catch (err) {
      setError('Failed to load artworks')
    } finally {
      setIsLoading(false)
    }
  }

  const renderArtworks = artworks.map(artwork => {
    return (
      <ArtworkCard
        key={artwork.id}
        artwork={artwork}
        showArtist={true}
      />
    )
  })

  if (error) {
    return (
      <p className="error">{error}</p>
    )
  }

  return (
    <section className="artwork-page">
      <div className="artwork-page-title-container">
        <h2 className="artwork-page-title">Artworks</h2>
        <Link
          className="add-artwork-link"
          to="/artworks/add"
        >
          Add Artwork
        </Link>
      </div>

      <div className="artwork-page-grid">
        {renderArtworks}
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

export default ArtworksPage