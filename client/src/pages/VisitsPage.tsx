import { useEffect, useState } from 'react'
import GalleryCard from '../components/GalleryCard'

import type { Visit } from '../types/visit'

import { getUserVisits } from '../api/visitApi'

import './VisitsPage.css'

const VisitsPage = () => {

  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const res = await getUserVisits()

        setVisits(res)
      } catch (err) {
        setError('Failed to load visits')
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const renderVisits = visits.map(visit => {
    return (
      <GalleryCard
        visit={visit}
      />
    )
  })

  if (error ) {
    return (
      <p className="error">{error}</p>
    )
  }

  if (isLoading) {
    return (
      <p className="loading">Loading...</p>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">My Visits</h2>
        <p className="museum-page-subheader">Museums you've visited</p>
      </div>
      <div className="page-grid">
        {renderVisits}
      </div>
    </div>
  )
}

export default VisitsPage