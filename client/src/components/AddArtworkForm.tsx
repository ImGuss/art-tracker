import { useState, useEffect } from 'react'

import { getArtists } from '../api/artistApi'
import { getMuseums } from '../api/museumApi'
import { createArtwork } from '../api/artworkApi'

import type { Artist } from '../types/artist'
import type { Museum } from '../types/museum'

const AddArtworkForm = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [museums, setMuseums] = useState<Museum[]>([])
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    

    const res = await createArtwork(data)
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
    <form action="" className="modal-form">
      <label htmlFor="add-artwork-title">Title</label>
      <input id="add-artwork-title" type="text" placeholder="e.g. Mona Lisa" />

      <div className="artwork-form-search-artist">
        <label htmlFor="add-artwork-artist-name">Artist</label>
        <input type="text"
          id="add-artwork-artist-name"
          value={searchTerm}
          name="name"
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
        <option value="">Unknown</option>
      </select>

      <label htmlFor="add-artwork-year-created">Year Created</label>
      <input id="add-artwork-year-created" type="number" />

      <label htmlFor="add-artwork-medium">Medium</label>
      <input id="add-artwork-medium" type="text" placeholder="e.g. Oil on canvas" name="medium" />

      <label htmlFor="add-artwork-image-url">Image URL</label>
      <input id="add-artwork-image-url" type="text" placeholder="e.g. wikimedia.com/mona-lisa.jpg" name="image_url" />

      <div className="modal-btn-container">
        <button className="gold-outline-btn">Cancel</button>
        <button
          onSubmit={handleSubmit}
          className="gold-btn"
        >
          Add Artwork
        </button>
      </div>
    </form>
  )
}

export default AddArtworkForm