import { useState } from 'react'
import { useNavigate } from 'react-router'

import { createArtist } from '../api/artistApi'

interface AddArtistFormProps {
  onClose: () => void;
}

const AddArtistForm = ({onClose}: AddArtistFormProps) => {
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = new FormData(e.currentTarget)

      const rawBirthYear = data.get('birth_year')
      const rawDeathYear = data.get('death_year')
  
      const name = data.get('name') as string | null
      const birth_year = rawBirthYear ? Number(rawBirthYear) : null
      const death_year = rawDeathYear ? Number(rawDeathYear) : null
      const birth_place = data.get('birth_place') as string | null
      const description = data.get('description') as string | null

      if (!name) {
        setError('Artist name is required')
        return
      }

      const body = {
        name,
        birth_year: birth_year || null,
        death_year: death_year || null,
        birth_place: birth_place || null,
        description: description || null
      }

      const res = await createArtist(body)

      navigate(`/artists/${res.id}`)

    } catch (err) {
      setError('Failed to add artist')
    }
  }

  return (
    <form
      className="modal-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="add-artist-name">Name</label>
      <input
        type="text"
        id="add-artist-name"
        name="name"
        placeholder="e.g. Vincent van Gogh"
      />
      
      <div className="modal-dual-input">
        <label htmlFor="add-artist-birth">Birth Year</label>
        <input
          type="number"
          id="add-artist-birth"
          name="birth_year"
        />

        <label htmlFor="add-artist-death">Death Year</label>
        <input
          type="number"
          id="add-artist-death"
          name="death_year"
        />
      </div>

      <label htmlFor="add-artist-birth-place">Birth Place</label>
      <input
        type="text"
        id="add-artist-birth-place"
        name="birth_place"
        placeholder="e.g. Paris, France"
      />

      <label htmlFor="add-artist-description">Description</label>
      <textarea
        name="description"
        id="add-artist-description"
        rows={4}
      ></textarea>

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
          Add Artist
        </button>
      </div>
    </form>
  )
}

export default AddArtistForm