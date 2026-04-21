import { Link } from 'react-router'

import type { Artist } from '../types/artist'

import './ArtistCard.css'

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {

  const {
    id,
    name,
    birth_year,
    death_year,
    example_artwork_url
  } = artist

  return (
    <article className="card">
      <img
        className="card-image"
        src={example_artwork_url ?? undefined}
        alt={`Example painting by ${name}`}
      />
      <p className="card-name">{name}</p>
      { birth_year ?
        <div className="artist-card-dates">
          <span>{birth_year}</span>
          <span> - </span> 
          <span>{death_year}</span>
        </div> :
        <div className="artist-card-dates">Unknown</div>
      }
      <Link
        className="gold-btn"
        to={`/artists/${id}`}
      >
        View Artworks
      </Link>
    </article>
  )
}

export default ArtistCard