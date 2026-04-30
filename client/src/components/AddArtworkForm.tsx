import { useState, useEffect } from 'react'

import { getArtists } from '../api/artistApi'

import type { Artist } from '../types/artist'

const AddArtworkForm = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [results, setResults] = useState<Artist[]>([])
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchTerm) {
      setResults([])
      return
    }

    const handler = setTimeout(() => {
      (async () => {
        try {
          const res = await getArtists(5, 0, searchTerm)
      
          setResults(res)
        } catch (err) {
          setError('Failed to find artists')
        }
      })()

    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowDropDown(true)
  }

  const handleSelect = (artist: Artist) => {
    setSelectedArtist(artist)
    setSearchTerm(artist.name)
    setShowDropDown(false)
  }

  const renderResults = results.map(artist => {
    return (
      <li
        key={artist.id}
        onMouseDown={() => handleSelect(artist)}
      >
        {artist.name}
      </li>
    )
  })

  return (
    <form action="" className="modal-form">
      <label htmlFor="">Title</label>
      <input type="text" placeholder="e.g. Mona Lisa" />

      <div className="artwork-form-search-artist">
        <label htmlFor="">Artist</label>
        <input type="text"
          value={searchTerm}
          onChange={handleChange}
          onBlur={() => setShowDropDown(false)}
          placeholder="e.g. Vincent van Gogh"
        />
        {
          showDropDown && results.length > 0 &&
          <ul>
            {renderResults}
          </ul>
        }
      </div>

      <label htmlFor="">Year Created</label>
      <input type="number" />

      <label htmlFor="">Medium</label>
      <input type="text" placeholder="e.g. Oil on canvas" />

      <label htmlFor="">Image URL</label>
      <input type="text" placeholder="e.g. wikimedia.com/mona-lisa.jpg" />

      <div className="modal-btn-container">
        <button className="gold-outline-btn">Cancel</button>
        <button className="gold-btn">Add Artwork</button>
      </div>
    </form>
  )
}

export default AddArtworkForm