import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

import { createCollection } from '../api/collectionApi'

interface AddCollectionFormProps {
  onClose: () =>  void;
}

const AddCollectionForm = ({onClose}: AddCollectionFormProps) => {
  const [error, setError] = useState<string |null>(null)

  const { user } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = new FormData(e.currentTarget)

      const name = data.get('collection_name') as string

      if (!name) {
        setError('Name is required')
        return
      }

      if (!user) {
        setError('Must be logged in to create collection')
        return
      }

      const body = {
        user_id: user.id,
        name: name
      }

      const res = await createCollection(body)

      navigate(`/collections/${res.id}`)
    } catch (err) {
      setError('Failed to add collection')
    }
  }

  return (
    <form 
      className="modal-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="add-collection-name">Collection Name</label>
      <input
        type="text"
        id="add-collection-name"
        name="collection_name"
        placeholder="e.g. Impressionist Art"
      />

      {error && <p className="form-error">{error}</p>}

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
          Add Collection
        </button>
      </div>
    </form>
  )
}

export default AddCollectionForm