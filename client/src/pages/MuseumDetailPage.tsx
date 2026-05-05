import { useEffect, useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { useAuth } from '../hooks/useAuth'

import type { MuseumDetail } from '../types/museum'

import { getMuseumById } from '../api/museumApi'

// components
import ArtworkCard from '../components/ArtworkCard'
import AddVisitForm from '../components/AddVisitForm'
import Modal from '../components/Modal'

import './MuseumDetailPage.css'

const MuseumDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  // state values
  const [museum, setMuseum] = useState<MuseumDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const { user } = useAuth()

  const numericId = id ? parseInt(id, 10) : NaN

  useEffect(() => {
    if (isNaN(numericId)) {
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await getMuseumById(numericId)

        setMuseum(res)
      } catch (err) {
        setError('Failed to fetch museum details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [numericId])

  if (!id) {
    return (
      <p className="error">Museum ID is required</p>
    )
  }

  if (isNaN(numericId)) {
    return (
      <p className="error">Invalid museum ID</p>
    )
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  if (isLoading) {
    return <p className="loading">Loading...</p>
  }

  if (!museum) {
    return <p className="error">Museum not found</p>
  }

  const renderArtworks = museum.artworks?.map(artwork => {
    return (
      <ArtworkCard
        key={artwork.id}
        artwork={artwork}
        showArtist={true}
      />
    )
  })

  return (
    <section className="page">
      <Link
        className="gold-link back-link"
        to="/museums"
      >
        <ArrowLeft size="0.8rem" /> Back to Museums
      </Link>

      <Modal
        isOpen={isOpen}
        onClose={() => {setIsOpen(false)}}
        title="Add Visit"
      >
        <AddVisitForm
          onClose={() => {setIsOpen(false)}}
          museumId={museum.id}
        />
      </Modal>

      <div className="detail-columns">
        <div className="detail-left-column">
          <div className="detail-image-wrap-landscape">
            <img
              src={museum.image_url ?? undefined}
              alt={museum.name}
            />
          </div>
        </div>

        <div className="museum-info">
          <h1 className="museum-detail-title">{museum.name}</h1>
          <p className="detail-subtitle">
            <span>{museum.city}, {museum.country}</span>
          </p>

          <div className="detail-meta-container">
            <div className="meta-label">City</div>
            <div className="meta-value">{museum.city}</div>
            <div className="meta-label">Country</div>
            <div className="meta-value">{museum.country}</div>
            <div className="meta-label">Artworks</div>
            <div className="meta-value">{museum.artworks?.length}</div>
          </div>

          {
            user ?
            <div className="museum-detail-visit-badge">
              {/* temporary static number until i add visits logic */}
              <Check size="0.8rem" /> <span>Visited 3 times</span>
            </div> : null
          }
          { 
            user ?
            <div className="detail-actions">
              <button
                className="gold-btn"
                onClick={() => setIsOpen(true)}
              >
                Log a Visit
              </button>
              <button className="gold-outline-btn">View All Visits</button>
            </div> : null
          }

        </div>
      </div>
          {/* Need to add visits once that's complete*/}

      <h2 className="section-title">Artworks</h2>
      <div className="page-grid">
        {
          renderArtworks.length > 0 ?
          renderArtworks :
          <p className="no-content">No artworks to show</p>
        }
      </div>
    </section>
  )
}

export default MuseumDetailPage