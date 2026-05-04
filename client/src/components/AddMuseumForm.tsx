import { useState } from 'react'
import { useNavigate } from 'react-router'

import { createMuseum } from '../api/museumApi'

interface AddMuseumFormProps {
  onClose: () => void;
}

const AddMuseumForm = ({onClose}: AddMuseumFormProps) => {
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = new FormData(e.currentTarget)

      const name = data.get('name') as string
      const city = data.get('city') as string
      const country = data.get('country') as string
      const image_url = data.get('image_url') as string | null

      if (!name) {
        setError('Museum name is required')
        return
      }

      if (!city) {
        setError('Museum city is required')
        return
      }

      if (!country) {
        setError('Museum country is required')
        return
      }

      const body = {
        name,
        city,
        country,
        image_url: image_url ? image_url : null
      }

      const res = await createMuseum(body)

      navigate(`/museums/${res.id}`)

    } catch (err) {
      setError('Failed to add museum')
    }
  }

  return (
    <form 
      className="modal-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="add-museum-name">Name</label>
      <input
        type="text"
        id="add-museum-name"
        name="name"
        placeholder="e.g. The Louvre"
      />

      <label htmlFor="add-museum-city">City</label>
      <input
        type="text"
        id="add-museum-city"
        name="city"
        placeholder="e.g. Paris"
      />

      <label htmlFor="add-museum-country">Country</label>
      <input
        type="text"
        id="add-museum-country"
        name="country"
        placeholder="e.g. France"
      />

      <label htmlFor="add-museum-image-url">Image URL</label>
      <input
        type="text"
        id="add-museum-image-url"
        name="image_url"
        placeholder="e.g. wikimedia.com/louvre.jpg"
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
          Add Museum
        </button>
      </div>
    </form>
  )
}

export default AddMuseumForm