import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import type { Artwork } from '../types/artwork'

import { getArtworks } from '../api/artworkApi'

import './ArtworksPage.css'

// components
import ArtworkCard from '../components/ArtworkCard'
import AddArtworkForm from '../components/AddArtworkForm'
import Modal from '../components/Modal'

const ArtworksPage = () => {

  // state values
  const [artworks, setArtworks] = useState<Artwork[]>([])
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
    <section className="page">

      <Modal
        isOpen={isOpen}
        onClose={() => {setIsOpen(false)}}
        title="Add Artwork"
      >
        <AddArtworkForm />
      </Modal>

      <div className="page-header">
        <h2 className="page-title">Artworks</h2>
        <button
          className="gold-btn"
          onClick={() => setIsOpen(true)}
        >
          Add Artwork
        </button>
      </div>

      <div className="page-grid">
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