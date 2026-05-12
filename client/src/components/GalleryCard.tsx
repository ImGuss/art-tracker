import { Link } from 'react-router'

import type { Visit } from '../types/visit'

import './GalleryCard.css'

interface GalleryCardProps {
  visit: Visit;
  // collection: Collection | null;
}

const GalleryCard = ({ visit }: GalleryCardProps) => {
  const thumbnails = visit.artwork_thumbnails.slice(0, 4)

  const renderArtworks = thumbnails.map(artwork => {
    return (
      <img
        key={artwork.id}
        className="mosaic-image"
        src={artwork.image_url ?? undefined}
        alt={artwork.title}
      />
    )
  })

  return (
    <article className="card gallery-card">
      <div className={`gallery-card-mosaic count-${renderArtworks.length}`}>
        {
          renderArtworks.length > 0 ?
          renderArtworks :
          <p className="no-artwork-thumbnails">No artworks saved</p>
        }
      </div>

      <h2>{visit.museum_name}</h2>

      <div className="date-link">
        <span>
          {
            new Date(visit.visit_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          }
        </span>
        <Link className="gold-link" to={`/visits/${visit.id}`}>
          {visit.artwork_thumbnails.length} artworks
        </Link>
      </div>
    </article>
  )
}

export default GalleryCard