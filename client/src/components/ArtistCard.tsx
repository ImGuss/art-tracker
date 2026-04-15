import { NavLink } from 'react-router'

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
    <article className="artist-card">
      <img
        className="example-artwork"
        src={example_artwork_url ?? undefined}
        alt={`Example painting by ${name}`}
      />
      <p className="artist-name">{name}</p>
      { birth_year ?
        <div className="artist-dates">
          <span className="birth-year">{birth_year}</span>
          <span> - </span> 
          <span className="death-year">{death_year}</span>
        </div> :
        <div className="artist-dates">Unknown</div>
      }
      <NavLink
        className="view-artworks-link"
        to={`/artists/${id}`}
      >
        View Artworks
      </NavLink>
    </article>
  )
}

export default ArtistCard