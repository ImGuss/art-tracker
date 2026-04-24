import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Link, useParams } from 'react-router'

import type { ArtistDetail } from '../types/artist'

import { getArtistById } from '../api/artistApi'

import './ArtistDetailPage.css'

//components
import ArtworkCard from '../components/ArtworkCard'

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  // state values
  const [artist, setArtist] = useState<ArtistDetail | null>(null)
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
        const res = await getArtistById(numericId)

        setArtist(res)
      } catch (err) {
        setError('Failed to fetch artist details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (!id) {
    return <p className="error">Artist ID is required</p>
  }

  if (isNaN(numericId)) {
    return <p className="error">Invalid artist ID</p>
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  if (isLoading) {
    return <p className="loading">Loading...</p>
  }

  if (!artist) {
    return <p className="error">Artist not found</p>
  }

  const artworkElements = artist.artworks.map(artwork => (
    <ArtworkCard
      key={artwork.id}
      artwork={artwork}
      showArtist={false}
    />
  ))

  return (
    <section className="page">
      <div className="detail-page-header">
        <Link
          className="gold-link back-link"
          to="/artists"
        >
          <ArrowLeft size="0.8rem" /> Back to Artists
        </Link>
        <h1 className="artist-name">{artist.name}</h1>
        <div className="artist-details">
          {
            artist.birth_year ?
            <div className="artist-detail-dates">
              <span className="artist-birth-year">{artist.birth_year}</span>
              <span> - </span>
              <span className="artist-death-year">{artist.death_year}</span>
            </div> :
            <div className="artist-detail-dates">Unknown</div>
          }
          <div className="birth-place">{artist.birth_place}</div>
        </div>
      </div>

      <div className="about-artist">
        <div className="artist-image-wrap">
          <img
            src={artist.artworks[0].image_url ?? undefined}
            alt={`Example artwork by ${artist.name}`}
          />
          <p className="image-caption">
            {`${artist.artworks[0].title}, ${artist.artworks[0].year_created ?? 'Year unknown'}`}
          </p>
        </div>
        <div className="artist-bio">
          <h2>About the Artist</h2>
          {
            artist.description ?
            <p>{artist.description}</p> :
            <p>Not much is known about {artist.name}.</p>
          }
        </div>
      </div>

      <div className="page">
        <h2 className="section-title">Artworks</h2>
        <div className="page-grid">
          {artworkElements}
        </div>
      </div>
    </section>
  )

}

export default ArtistDetailPage