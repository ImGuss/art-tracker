import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Link, useParams } from 'react-router'

import type { MuseumDetail } from '../types/museum'

import { getMuseumById } from '../api/museumApi'

// components
import ArtworkCard from '../components/ArtworkCard'

import './MuseumDetailPage.css'

const MuseumDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  // state values
  const [museum, setMuseum] = useState<MuseumDetail | null>(null)
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
      {renderArtworks}
    </section>
  )
}

export default MuseumDetailPage