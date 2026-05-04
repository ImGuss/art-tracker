import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { getArtists } from '../api/artistApi'
import { getMuseums } from '../api/museumApi'
import { createArtwork } from '../api/artworkApi'

import type { Artist } from '../types/artist'
import type { Museum } from '../types/museum'

interface AddArtworkFormProps {
  onClose: () => void
}

const AddArtworkForm = ({onClose}: AddArtworkFormProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [museums, setMuseums] = useState<Museum[]>([])
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!searchTerm) {
      setArtists([])
      return
    }

    const handler = setTimeout(() => {
      (async () => {
        try {
          const res = await getArtists(5, 0, searchTerm)
      
          setArtists(res)
        } catch (err) {
          setError('Failed to find artists')
        }
      })()

    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  useEffect(() => {
    (async () => {
      try {
        const res = await getMuseums()

        setMuseums(res)
      } catch (err) {
        setError('Failed to find museums')
      }
    })()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowDropDown(true)
  }

  const handleSelect = (artist: Artist) => {
    setSelectedArtist(artist)
    setSearchTerm(artist.name)
    setShowDropDown(false)
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = new FormData(e.currentTarget)

      const rawMuseumId = data.get('museum')
      const rawYearCreated = data.get('year_created')
  
      const title = data.get('title') as string
      const artist_id = selectedArtist?.id ?? null
      const museum_id = rawMuseumId ? Number(rawMuseumId) : null
      const year_created = rawYearCreated ? Number(rawYearCreated) : null 
      const medium = data.get('medium') as string | null
      const image_url = data.get('image_url') as string | null
  
  
      if (!title) {
        setError('Artwork title is required')
        return
      }
  
      const body = {
        title,
        artist_id: artist_id || null,
        museum_id: museum_id || null,
        year_created: year_created || null,
        medium: medium || null,
        image_url: image_url || null
      }
  
      console.log(body)
  
      const res = await createArtwork(body)
  
      navigate(`/artworks/${res.id}`)
      
    } catch (err) {
      setError('Error adding artwork')
    }
  }

  const renderArtists = artists.map(artist => {
    return (
      <li
        key={artist.id}
        onMouseDown={() => handleSelect(artist)}
      >
        <span>{artist.name}</span>
        <span
          className="artist-list-item-year"
        >
          {artist.birth_year} - {artist.death_year}
        </span>
      </li>
    )
  })

  const renderMuseums = museums.map(museum => {
    return (
      <option key={museum.id} value={museum.id}>
        {museum.name} - {museum.city}
        </option>
    )
  })

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <label htmlFor="add-artwork-title">Title</label>
      <input
        id="add-artwork-title"
        type="text"
        name="title"
        placeholder="e.g. Mona Lisa"
      />

      <div className="artwork-form-search-artist">
        <label htmlFor="add-artwork-artist-name">Artist</label>
        <input type="text"
          id="add-artwork-artist-name"
          value={searchTerm}
          onChange={handleChange}
          onBlur={() => setShowDropDown(false)}
          placeholder="e.g. Vincent van Gogh"
        />
        {
          showDropDown && artists.length > 0 &&
          <ul>
            {renderArtists}
          </ul>
        }
      </div>

      <label htmlFor="add-artwork-museum">Museum</label>
      <select id="add-artwork-museum" name="museum">
        <option value="">Select Museum</option>
        {renderMuseums}
      </select>

      <label htmlFor="add-artwork-year-created">Year Created</label>
      <input
        id="add-artwork-year-created"
        name="year_created"
        type="number"
      />

      <label htmlFor="add-artwork-medium">Medium</label>
      <input
        id="add-artwork-medium"
        type="text"
        name="medium"
        placeholder="e.g. Oil on canvas"
      />

      <label htmlFor="add-artwork-image-url">Image URL</label>
      <input
        id="add-artwork-image-url"
        type="text"
        name="image_url"
        placeholder="e.g. wikimedia.com/mona-lisa.jpg"
      />
      { error && <p className="form-error">{error}</p> }

      <div className="modal-btn-container">
        <button
          className="gold-outline-btn"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="gold-btn"
          type="submit"
        >
          Add Artwork
        </button>
      </div>
    </form>
  )
}

export default AddArtworkForm