import { useEffect, useState } from 'react'

import { useParams } from 'react-router'

import type { ArtistDetail } from '../types/artist'
import type { Artwork } from '../types/artwork'

import { getArtistById } from '../api/artistApi'

import './ArtistDetailPage.css'

//components
import ArtworkCard from '../components/ArtworkCard'

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <p className="error">Artist ID is required</p>
  }

  const numericId = parseInt(id, 10)

  if (isNaN(numericId)) {
    return <p className="error">Invalid artist ID</p>
  }

  const [artist, setArtist] = useState<ArtistDetail | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await getArtistById(numericId)

        setArtist(res)
        setArtworks(res.artworks)
      } catch (err) {
        setError('Failed to fetch artist details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const artworkElements = artworks.map(artwork => (
    <ArtworkCard
      key={artwork.id}
      artwork={artwork}
    />
  ))

  if (error) {
    return <p className="error">{error}</p>
  }

  if (isLoading) {
    return <p className="loading">Loading...</p>
  }

  return (
    <section className="artist-detail-page">
      <div className="artist-title-container">
        <h1 className="artist-name">{artist?.name}</h1>
        {
          artist?.birth_year ?
          <div className="artist-detail-dates">
            <span className="artist-birth-year">{artist?.birth_year}</span>
            <span> - </span>
            <span className="artist-death-year">{artist?.death_year}</span>
          </div> :
          <div className="artist-detail-dates">Unknown</div>
        }
        <div className="birth-place">{artist?.birth_place}</div>
      </div>

      <div className="about-artist">
        <div className="artist-image-wrap">
          <img
            src={artist?.artworks[0]?.image_url ?? undefined}
            alt={`Example artwork by ${artist?.name}`}
          />
          <p className="image-caption">
            {`${artist?.artworks[0]?.title}, ${artist?.artworks[0]?.year_created ?? 'Year unknown'}`}
          </p>
        </div>
        <div className="artist-bio">
          <h2>About the Arist</h2>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum magnam ullam facilis excepturi saepe mollitia ratione, optio veritatis rem accusantium eligendi? Illo maiores commodi nesciunt esse cumque doloremque beatae numquam!</p>

          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus porro similique deleniti labore aspernatur tenetur. Laborum, dolorem reprehenderit, quod nulla cum et eum neque dicta omnis, voluptates nesciunt iusto vitae!</p>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab quaerat veniam eaque facere veritatis soluta, quod non dolorem ea cumque exercitationem eveniet vitae sapiente optio deleniti dolore rerum, earum ratione!</p>
        </div>
      </div>

      <div className="artworks-container">
        <h2 className="artworks-title">Artworks</h2>
        <div className="artwork-grid">
          {artworkElements}
        </div>
      </div>
    </section>
  )

}

export default ArtistDetailPage