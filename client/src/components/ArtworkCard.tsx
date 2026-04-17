import { Link } from 'react-router'

import type { Artwork } from '../types/artwork'

import './ArtworkCard.css'

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {

  const {
    id,
    title,
    image_url,
    year_created,
    medium
  } = artwork

  return (
    <article className="artwork-card">
      <img
        className="artwork-image"
        src={image_url ?? undefined}
        alt={title}
      />
      <p className="artwork-title">{title}</p>
      <p className="artwork-year">{year_created ?? 'Year unknown'}</p>
      <p className="artwork-medium">{medium ?? 'Medium unknown'}</p>
      <Link
        className="view-details-link"
        to={`/artworks/${id}`}
      >
        View Details
      </Link>
    </article>
  )
}

export default ArtworkCard