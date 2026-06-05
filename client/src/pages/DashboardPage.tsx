import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

import type { Artwork } from '../types/artwork'
import type { Visit } from '../types/visit'
import type { Collection } from '../types/collection'

import { getUserVisits } from '../api/visitApi'
import { getUserCollections } from '../api/collectionApi'
import { getArtworks } from '../api/artworkApi'

import './DashboardPage.css'

// components
import DashboardCard from '../components/DashboardCard'
import ArtworkCard from '../components/ArtworkCard'
import { ArrowRight, Plus } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuth()

  // state values
  const [visits, setVisits] = useState<Visit[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [error, setError] = useState<string | null>(null)

  // derived values
  const artworksSeen = visits.reduce((acc, visit) => acc + visit.artwork_thumbnails.length, 0)
  const museumsVisited = new Set(visits.map(visit => visit.museum_id)).size
  const recentVisits = visits.length > 3 ? visits.slice(0, 3) : visits
  const recentCollections = collections.length > 3 ? collections.slice(0, 3) : collections

  useEffect(() => {
    try {
      (async () => {
        const [visitData, collectionData, recentArtworks] = await Promise.all([getUserVisits(), getUserCollections(), getArtworks(3, 0)])
  
        setVisits(visitData)
        setCollections(collectionData)
        setArtworks(recentArtworks)
      })()
    } catch (err) {
      setError('Failed to get user data') 
    }
  }, [])

  if (!user) {
    // will work on logic for logged out user after logged in user logic
    return(
      <div>
        Dashboard Page
        <Link to="/login">Login</Link>
      </div>
    )
  }

  const renderRecentVisits = recentVisits.map(visit => {
    return (
      <DashboardCard
        key={visit.id}
        id={visit.id}
        title={visit.museum_name}
        date={visit.visit_date}
        artworkThumbnails={visit.artwork_thumbnails}
        linkTo="/visits/"
      />
    )
  })

  const renderRecentCollections = recentCollections.map(collection => {
    return (
      <DashboardCard
        key={collection.id}
        id={collection.id}
        title={collection.name}
        date={collection.created_at}
        artworkThumbnails={collection.artwork_thumbnails}
        linkTo="/collections/"
      />
    )
  })

  const renderRecentArtworks = artworks.map(artwork => {
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
      <div className="dashboard-page-header">
        <h2 className="page-title">
          Welcome back, <span className="gold-header">{user.username}</span>
        </h2>
        <p>Track your art, museum visits and collections</p>
      </div>

      <div className="dashboard-user-stats">
        <div className="dashboard-stat-item">
          <span className="stat-number">{artworksSeen} </span>
          <span className="stat-name">artworks seen</span>
        </div>
        <div className="dashboard-stat-item">
          <span className="stat-number">{museumsVisited} </span>
          <span className="stat-name">museums visited</span>
        </div>
        <div className="dashboard-stat-item">
          <span className="stat-number">{collections.length} </span>
          <span className="stat-name">collections</span>
        </div>
        <div className="dashboard-stat-item">
          <span className="stat-number">{visits.length} </span>
          <span className="stat-name">visits logged</span>
        </div>
      </div>

      <div className="dashboard-two-column">
        <div className="dashboard-left-column">
          <div className="dashboard-recent">
            <div className="dashboard-recent-header">
              <h2>Recent Visits</h2>
              <Link className="gold-link" to="/visits">
                View all visits <ArrowRight size="0.8rem" />
              </Link>
            </div>
            {renderRecentVisits}
          </div>
          <div className="dashboard-recent">
            <div className="dashboard-recent-header">
             <h2>Recent Collections</h2>
             <Link className="gold-link" to="/collections">
              View all collections <ArrowRight size="0.8rem" />
            </Link>
            </div>
            {renderRecentCollections}
          </div>
        </div>

        <div className="dashboard-right-column">
          <div className="dashboard-quick-add">
            <h2>Quick Add</h2>
            <div className="dashboard-quick-add-links">
              <Link className="gold-btn" to="/museums"><Plus size="0.8rem" /> Log a Visit</Link>
              <Link className="gold-outline-btn" to="/collections"><Plus size="0.8rem" /> New Collection</Link>
              <Link className="gold-outline-btn" to="/artworks"><Plus size="0.8rem" /> Add Artwork</Link>
            </div>
          </div>

          <div className="dashboard-recent-artworks">
            {renderRecentArtworks}
          </div>
        </div>
      </div>

      { error && <p className="error">{error}</p> }
    </section>
  )
}

export default DashboardPage