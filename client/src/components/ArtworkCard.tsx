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
    name,
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
          name ?
          <Link 
            className="artwork-artist"
            to={`/artists/${artist_id}`}
          >
            {name}
          </Link> :
          <p className="artwork-artist">Unknown</p>
        )
      }
      <p className="artwork-year">{year_created ?? 'Year unknown'}</p>
      <p className="artwork-medium">{medium ?? 'Medium unknown'}</p>
      <Link
        className="gold-link-btn"
        to={`/artworks/${id}`}
      >
        View Details
      </Link>
    </article>
  )
}

export default ArtworkCard