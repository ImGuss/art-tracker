import { Link } from 'react-router'

import { Dot } from 'lucide-react'

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
        className="dashboard-mosaic-image"
        src={artwork.image_url ?? undefined}
        alt={artwork.title}
      />
    )
  })

  return (
    <Link to={`${data.linkTo}${data.id}`}>
      <article className="dashboard-card">
        <div className={`dashboard-card-mosaic count-${renderArtworks.length}`}>
          {
            renderArtworks.length > 0 ?
            renderArtworks :
            <p className="dashboard-no-artwork-thumbnails">No artworks</p>
          }
        </div>

        <div className="dashboard-card-info">
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
            <span> <Dot size="0.9rem" /> </span>
            <span>
              {data.artworkThumbnails.length} artworks
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default DashboardCard