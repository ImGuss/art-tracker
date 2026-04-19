import { Link } from 'react-router'

import type { Museum } from '../types/museum'

import './MuseumCard.css'

interface MuseumProps {
  museum: Museum;
}

const MuseumCard = ({ museum }: MuseumProps) => {

  const {
    id,
    name,
    city,
    country,
    image_url
  } = museum

  return (
    <article className="card">
      <img
        className="card-image"
        src={image_url ?? undefined}
        alt={name}
      />
      <p className="card-name">{name}</p>
      <div className="museum-location">
        <span>{city}, {country}</span>
      </div>

      <Link
        className="gold-link-btn"
        to={`/museums/${id}`}
      >
        View Details
      </Link>
    </article>
  )
}

export default MuseumCard