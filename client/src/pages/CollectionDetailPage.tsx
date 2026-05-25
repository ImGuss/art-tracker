import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'

import type { CollectionDetail } from '../types/collection'
import type { Artwork } from '../types/artwork'

import {
  getCollectionById,
  addArtworkToCollection,
  removeArtworkFromCollection 
} from '../api/collectionApi'
import { getArtworks } from '../api/artworkApi'

import { ArrowLeft, X } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'

import './CollectionDetailPage.css'

const CollectionDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Artwork[]>([])
  const [showDropDown, setShowDropDown] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const numericId = id ? parseInt(id, 10) : NaN

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([])
      return
    }

    if (!collection) {
      setError('Collection not found')
      return
    }

    const handler = setTimeout(() => {
      (async () => {
        try {
          const res = await getArtworks(5, 0, searchTerm)

          setSearchResults(res)
        } catch (err) {
          setError('Failed to find artworks')
        }
      })()
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, collection])

  useEffect(() => {
    (async () => {
      try {
        const res = await getCollectionById(numericId)

        setCollection(res)

        setArtworks(res.artworks)
      } catch (err) {
        setError('Failed to fetch collection data')
      }
    })()
  }, [])

  if (!collection) {
    return <p className="error">Collection not found</p>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowDropDown(true)
  }

  const addArtwork = async (artwork: Artwork) => {
    try {
      await addArtworkToCollection(collection.id, artwork.id)

      console.log('inside addartwork')

      setArtworks(prevArtworks => [...prevArtworks, artwork])
      setShowDropDown(false)
      setSearchTerm('')
      setSearchResults([])
    } catch (err) {
      setError('Failed to add artwork to collection')
    }
  }

  const removeArtwork = async (artworkId: number) => {
    try {
      await removeArtworkFromCollection(collection.id, artworkId)

      setArtworks(prevArtworks => prevArtworks.filter(artwork => (
        artwork.id !== artworkId
      )))
    } catch (err) {
      setError('Failed to remove saved artwork')
    }
  }

  const renderArtworks = artworks.map(artwork => {

    return (
      <div key={artwork.id} className="collection-artwork-card">
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
      <li
        key={artwork.id}
        onMouseDown={() => addArtwork(artwork)}
      >
        <ArtworkCard
          artwork={artwork}
          showArtist={true}
        />
      </li>
    )
  })

  return (
    <section className="page">
      <div className="detail-page-header">
        <Link
          className="gold-link back-link"
          to="/collections"
        >
          <ArrowLeft size="0.8rem" /> Back to Collections
        </Link>
        <h1 className="collection-detail-title">{collection.name}</h1>
        <span className="collection-detail-date">
          Created {
            new Date(collection.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          }
        </span>
      </div>

      <div className="collection-artwork-search">
        <label htmlFor="collection-add-new-artwork">Search for artworks to add</label>
        <input
          type="text"
          id="collection-add-new-artwork"
          value={searchTerm}
          onChange={handleChange}
          onBlur={() => setShowDropDown(false)}
          placeholder="Search artworks..."
        />

        {
          showDropDown &&
          <ul>
            {renderSearchResults}
          </ul>
        }
      </div>

      <h2 className="section-title">Artworks Saved to Collection</h2>
      <div className="page-grid">
        {
          artworks.length > 0 ?
          renderArtworks :
          <p className="no-content">No artworks saved to collection yet</p>
        }
      </div>

      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default CollectionDetailPage