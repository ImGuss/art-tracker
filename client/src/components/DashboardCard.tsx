import { Link } from 'react-router'

import type { ArtworkThumbnail } from '../types/common'

import './DashboardCard.css'

interface DashboardCardProps {
  id: number;
  title: string;
  date: string;
  artworkThumbnails: ArtworkThumbnail[];
  linkTo: string;
}

const DashboardCard = (data: DashboardCardProps) => {
  const thumbnails = data.artworkThumbnails.slice(0, 4)

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
    <article className="dashboard-card">
      <div className={`dashboard-card-mosaic count-${renderArtworks.length}`}>
        {
          renderArtworks.length > 0 ?
          renderArtworks :
          <p className="no-artwork-thumbnails">No artworks</p>
        }
      </div>

      <h2>{data.title}</h2>

      <div className="dashboard-date-link">
        <span>
          {
            new Date(data.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          }
        </span>

        <Link className="gold-link" to={`${data.linkTo}${data.id}`}>
          {data.artworkThumbnails.length} artworks
        </Link>
      </div>
    </article>
  )
}

export default DashboardCard