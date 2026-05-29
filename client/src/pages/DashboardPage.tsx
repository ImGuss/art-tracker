import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

import { getUserVisits } from '../api/visitApi'
import { getUserCollections } from '../api/collectionApi'

import type { Visit } from '../types/visit'
import type { Collection } from '../types/collection'

import './DashboardPage.css'

const DashboardPage = () => {
  const { user } = useAuth()

  // state values
  const [visits, setVisits] = useState<Visit[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [error, setError] = useState<string | null>(null)

  // derived values
  let artworksSeen = 0
  const museumsVisited = ([...new Map(visits.map(visit => [visit.museum_id, visit.id]))]).length

  for (const visit of visits) {
    artworksSeen += visit.artwork_thumbnails.length
  }

  useEffect(() => {
    try {
      (async () => {
        const [visitData, collectionData] = await Promise.all([getUserVisits(), getUserCollections()])
  
        setVisits(visitData)
        setCollections(collectionData)
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



  return (
    <section className="page">
      <div className="page-header">
        <h2 className="page-title">
          Welcome back, <span className="gold-header">{user.username}</span>
        </h2>
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


      { error && <p className="error">{error}</p> }
    </section>
  )
}

export default DashboardPage