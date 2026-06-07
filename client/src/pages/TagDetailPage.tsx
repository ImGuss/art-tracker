import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import type { Tag } from '../types/tag'
import type { Artwork } from '../types/artwork'

import { getTagById } from '../api/tagApi'

import { ArrowLeft } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'

import './TagDetailPage.css'

const TagDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  const [tag, setTag] = useState<Tag | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const limit = 20

  const numericId = id ? parseInt(id, 10) : NaN

  useEffect(() => {
    (async () => {
      try {
        const res = await getTagById(numericId, limit, 0)

        if (res.length < limit) {
          setHasMore(false)
        }

        setTag(res)
        setArtworks(res.artworks)
        setOffset(prevOffset => prevOffset + limit)
      } catch (err) {
        setError('Failed to fetch tag')
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const loadMore = async () => {
    try {
      setIsLoading(true)
      const res = await getTagById(numericId, limit, offset)

      if (res.length < limit) {
        setHasMore(false)
      }

      setArtworks(prevArtworks => [...prevArtworks, ...res.artworks])
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

  if (!tag) {
    return (
      <p className="error">Failed to load tag</p>
    )
  }

  return (
    <section className="page">
      <div className="detail-page-header">
        <Link
          className="gold-link back-link"
          to="/tags"
        >
          <ArrowLeft size="0.8rem" /> Back to Tags
        </Link>
        <h1 className="visit-detail-title">{tag.name}</h1>
      </div>
      <h2 className="section-title">Artworks</h2>
      <div className="page-grid">
        {
          artworks.length > 0 ?
          renderArtworks :
          <p className="no-content">No artworks exist for this tag</p>
        }
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

export default TagDetailPage