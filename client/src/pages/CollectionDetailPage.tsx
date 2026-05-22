import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'

import type { CollectionDetail } from '../types/collection'
import type { Artwork } from '../types/artwork'



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

  const renderArtworks = artworks.map(artwork => {
    return (
      <div key={artwork.id} className="collection-artwork-card">
        <ArtworkCard
          artwork={artwork}
          showArtist={true}
        />
        <button
          className="gold-btn delete-logged-artwork-btn"
          // onClick={}
        >
          <X size="0.8rem" />
        </button>
      </div>
    )
  })

  return (
    <section className="page">
      <div className="detail-page-header">
        <Link
          className="gold-link back-link"
          to="/collections"
        >
          Back to Collections
        </Link>
        <h1 className="collection-detail-title">Title</h1>
        <span className="collection-detail-date">
          Created 02-09-2023
        </span>
      </div>

      <div className="collection-artwork-search">
        <label htmlFor="collection-add-new-artwork">Search for artworks to add</label>
        <input
          type="text"
          id="collection-add-new-artwork"
          value={searchTerm}
          // onChange={}
          onBlur={() => setShowDropDown(false)}
          placeholder="Search artworks..."
        />

        {/* show dropdown logic */}
      </div>

      <h2 className="section-title">Artworks Saved to Collection</h2>
      <div className="page-grid">
        {
          artworks.length > 0 ?
          renderArtworks :
          <p className="no-content">No artworks saved to collection yet</p>
        }
      </div>
    </section>
  )
}

export default CollectionDetailPage