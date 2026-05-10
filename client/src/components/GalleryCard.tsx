import { Link } from 'react-router'

import type { Visit } from '../types/visit'

import './GalleryCard.css'

interface GalleryCardProps {
  visit: Visit
}

const GalleryCard = ({ visit }: GalleryCardProps) => {

  const renderArtworks = visit.artwork_thumbnails.map(artwork => {
    return (
      <div key={artwork.id} className="mosaic-image">
        <img 
          src={artwork.image_url ?? undefined}
          alt={artwork.title}
        />
      </div>
    )
  })

  return (
    <article className="card">
      <div className="gallery-artwork-mosaic">

      </div>
    </article>
  )
}

export default GalleryCard