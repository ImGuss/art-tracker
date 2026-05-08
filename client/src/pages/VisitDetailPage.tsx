import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'

import type { VisitDetail } from '../types/visit'
import type { Artwork } from '../types/artwork'

import { getVisitById, removeArtworkFromVisit } from '../api/visitApi'
import { getArtworksByMuseum } from '../api/museumApi'

import { ArrowLeft, X } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'

import './VisitDetailPage.css'

const VisitDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  const [visit, setVisit] = useState<VisitDetail | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Artwork[]>([])
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [error, setError] = useState<string | null>(null)

  const numericId = id ? parseInt(id, 10) : NaN

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([])
      return
    }

    const handler = setTimeout(() => {
      (async () => {
        try {
          const res = await getArtworksByMuseum(numericId, 5, 0, searchTerm)

          setSearchResults(res)
        } catch (err) {
          setError('Failed to find artworks')
        }
      })()
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVisitById(numericId)

        setVisit(res)
        setArtworks(res.artworks)
      } catch (err) {
        setError('Failed to fetch visit data')
      }
    }

    fetchData()
  }, [])

  if (!visit) {
    return <p className="error">Visit not found</p>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowDropDown(true)
  }

  const removeArtwork = async (artworkId: number) => {
    try {
      await removeArtworkFromVisit(visit.id, artworkId)
      setArtworks(prevArtworks => prevArtworks.filter(artwork => (
        artwork.id !== artworkId
      )))
    } catch (err) {
      setError('Failed to remove logged artwork')
    }
  }

  const renderArtworks = artworks?.map(artwork => {
    return (
      <div key={artwork.id} className="visit-artwork-card">
        <ArtworkCard
          artwork={artwork}
          showArtist={true}
        />
        <button
          className="gold-btn delete-logged-artwork-btn"
          onClick={() => {removeArtwork(artwork.id)}}
        >
          <X size="0.8rem" />
        </button>
      </div>
    )
  })

  const renderSearchResults = searchResults.map(artwork => {
    return (
      <div
        key={artwork.id}
        onClick={() =>  setSelectedArtwork(artwork)}
      >
        <ArtworkCard
          artwork={artwork}
          showArtist={true}
        />
      </div>
    )
  })

  return (
    <section className="page">
      <div className="detail-page-header">
        <Link
          className="gold-link back-link"
          to="/visits"
        >
          <ArrowLeft size="0.8rem" /> Back to Visits
        </Link>
        <h1 className="visit-detail-title"></h1>
      </div>

      <div className="">
        <label htmlFor="add-new-artwork">Search for artworks to log</label>
        <input
          type="text"
          id ="add-new-artwork"
          value={searchTerm}
          onChange={handleChange}
          onBlur={() => setShowDropDown(false)}
          placeholder="Search artworks..."
        />

        {
          showDropDown &&
          <div>
            {renderSearchResults}
          </div>
        }
      </div>

      <h2 className="section-title">Logged Artworks</h2>
      <div className="page-grid">
        {
          artworks?.length > 0 ?
          renderArtworks :
          <p className="no-content">No artworks logged in this visit yet</p>
        }
      </div>

      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default VisitDetailPage