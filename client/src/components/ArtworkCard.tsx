import { Link } from 'react-router'

import type { Artwork } from '../types/artwork'

import './ArtworkCard.css'

interface ArtworkCardProps {
  artwork: Artwork;
  showArtist: boolean;
}

const ArtworkCard = ({ artwork, showArtist }: ArtworkCardProps) => {

  const {
    id,
    title,
    artist_id,
    artist_name,
    year_created,
    medium,
    image_url
  } = artwork

  return (
    <article className="card">
      <img
        className="card-image"
        src={image_url ?? undefined}
        alt={title}
      />
      <p className="artwork-title">{title}</p>
      {showArtist &&
        (
          artist_name ?
          <Link 
            className="gold-link"
            to={`/artists/${artist_id}`}
          >
            {artist_name}
          </Link> :
          <p className="artwork-artist">Unknown</p>
        )
      }
      <p className="artwork-year">{year_created ?? 'Year unknown'}</p>
      <p className="artwork-medium">{medium ?? 'Medium unknown'}</p>
      <Link
        className="gold-btn"
        to={`/artworks/${id}`}
      >
        View Details
      </Link>
    </article>
  )
}

export default ArtworkCard