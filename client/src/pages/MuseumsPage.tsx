import { useEffect, useState } from 'react'

import type { Museum } from '../types/museum'

import { getMuseums } from '../api/museumApi'

import './MuseumsPage.css'

// components
import MuseumCard from '../components/MuseumCard'
import AddMuseumForm from '../components/AddMuseumForm'
import Modal from '../components/Modal'

const MuseumsPage = () => {

  // state values
  const [museums, setMuseums] = useState<Museum[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await getMuseums()

        setMuseums(res)
      } catch (err) {
        setError('Failed to load museums')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <p className="error">{error}</p>
    )
  }

  if (isLoading) {
    return (
      <p className="loading">Loading...</p>
    )
  }

  const renderMuseums = museums.map(museum => {
    return (
      <MuseumCard
        key={museum.id}
        museum={museum}
      />
    )
  })

  return (
    <section className="page">

      <Modal
        isOpen={isOpen}
        onClose={() => {setIsOpen(false)}}
        title="Add Museum"
      >
        <AddMuseumForm
          onClose={() => {setIsOpen(false)}}
        />
      </Modal>
      <div className="page-header">
        <h2 className="page-title">Museums</h2>
        <button
          className="gold-btn"
          onClick={() => {setIsOpen(true)}}
        >
          Add Museum
        </button>
      </div>

      <div className="page-grid">
        {renderMuseums}
      </div>
      
    </section>
  )
}

export default MuseumsPage