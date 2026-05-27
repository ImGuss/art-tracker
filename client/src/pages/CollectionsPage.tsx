import { useState, useEffect } from 'react'

import type { Collection } from '../types/collection'

import { getUserCollections } from '../api/collectionApi'

// components
import GalleryCard from '../components/GalleryCard'
import AddCollectionForm from '../components/AddCollectionForm'
import Modal from '../components/Modal'

const CollectionsPage = () => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        setIsloading(true)

        const res = await getUserCollections()

        setCollections(res)
      } catch (err) {
        setError('Error finding collections')
      } finally {
        setIsloading(false)
      }
    })()
  }, [])

  if (error) {
    return (
      <p className="error">{error}</p>
    )
  }

  if (isLoading) {
    return(
      <p className="loading">Loading...</p>
    )
  }

  const renderCollections = collections.map(collection => {
    return (
      <GalleryCard
        key={collection.id}
        id={collection.id}
        title={collection.name}
        date={collection.created_at}
        artworkThumbnails={collection.artwork_thumbnails}
        linkTo="/collections/"
      />
    )
  })

  return (
    <section className="page">

    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create Collection"
    >
      <AddCollectionForm
        onClose={() => setIsOpen(false)}
      />
    </Modal>

      <div className="page-header">
        <h2 className="page-title">My Collections</h2>
        <button
          className="gold-btn"
          onClick={() => setIsOpen(true)}
        >
          Create Collection
        </button>
      </div>

      <div className="page-grid">
        {renderCollections}
      </div>
    </section>
  )
}

export default CollectionsPage