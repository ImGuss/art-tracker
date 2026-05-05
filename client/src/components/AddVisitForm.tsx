import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

import { createVisit } from '../api/visitApi'

interface AddVisitFormProps {
  onClose: () => void;
  museumId: number
}

const AddVisitForm = ({onClose, museumId}: AddVisitFormProps) => {
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = new FormData(e.currentTarget)

      const visit_date = data.get('visit_date') as string

      if (!visit_date) {
        setError('Visit date required')
        return
      }

      if (!user) {
        setError('Must be logged in to log a visit')
        return
      }

      const body = {
        user_id: user?.id,
        museum_id: museumId,
        visit_date: visit_date
      }

      const res = await createVisit(body)

      navigate(`/visits/${res.id}`)
    } catch (err) {
      setError('Failed to add visit')
    }
  }

  return (
    <form
      className="modal-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="add-visit-date">Visit Date</label>
      <input
        type="date"
        id="add-visit-date"
        name="visit_date"
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
          Add Visit
        </button>
      </div>
    </form>
  )
}

export default AddVisitForm