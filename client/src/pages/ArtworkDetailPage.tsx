import { useEffect, useState } from 'react'
import { ArrowLeft, Dot } from 'lucide-react'

import { Link, useParams } from 'react-router'

import type { ArtworkDetail } from '../types/artwork'

import { getArtworkById } from '../api/artworkApi'

import './ArtworkDetailPage.css'

const ArtworkDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  // state values
  const [artwork, setArtwork] = useState<ArtworkDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const numericId = id ? parseInt(id, 10) : NaN

  useEffect(() => {
    if (isNaN(numericId)) {
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await getArtworkById(numericId)

        setArtwork(res)
      } catch (err) {
        setError('Failed to fetch artist details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (!id) {
    return <p className="error">Artwork ID is required</p>
  }

  if (isNaN(numericId)) {
    return <p className="error">Invalid artwork ID</p>
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  if (isLoading) {
    return <p className="loading">Loading...</p>
  }

  if (!artwork) {
    return <p className="error">Artwork not found</p>
  }

  const renderTags = artwork.tags?.map(tag => {
    return (
      <span key={tag} className="tag-pill">{tag}</span>
    )
  })

  return (
    <section className="page">
      <Link
        className="gold-link back-link"
        to="/artworks"
      >
        <ArrowLeft size="0.8rem" /> Back to Artworks
      </Link>

      <div className="artwork-details">
        <div className="artwork-left-column">
          <div className="artwork-image-wrap">
            <img
              src={artwork.image_url ?? undefined}
              alt={artwork.title}
            />
          </div>
          <div className="tag-list">
            {renderTags}
          </div>
        </div>

        <div className="artwork-right-column">
          <div className="artwork-detail-info">
            <h1 className="artwork-detail-title">{artwork.title}</h1>
            <p className="artwork-detail-subtitle">
              <span>{artwork.year_created}</span>
              <Dot size="0.8rem" />
              <span>{artwork.medium}</span>
            </p>

            <div className="artwork-meta-container">
                <div className="meta-label">Artist</div>
                <div className="meta-value">
                  {
                    artwork.artist_name ?
                    <Link
                      className="gold-link"
                      to={`/artists/${artwork.artist_id}`}
                    >
                      {artwork.artist_name}
                    </Link> :
                    <p>Unknown</p>
                  }
                </div>
                <div className="meta-label">Museum</div>
                <div className="meta-value">
                  <Link
                    className="gold-link"
                    to={`/museums/${artwork.museum_id}`}
                  >
                    {artwork.museum_name}
                  </Link>
                </div>
                <div className="meta-label">Year</div>
                <div className="meta-value">{artwork.year_created}</div>

                <div className="meta-label">Medium</div>
                <div className="meta-value">{artwork.medium}</div>

              <div className="artwork-actions">
                <button
                  className="gold-btn"
                >
                  Add to Collection
                </button>
                <button
                  className="gold-outline-btn"
                >
                  Log in a Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArtworkDetailPage