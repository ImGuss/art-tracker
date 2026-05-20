import { useState, useEffect } from 'react'

import type { Collection } from '../types/collection'

import { getUserCollections } from '../api/collectionApi'

const CollectionsPage = () => {
  const [collections, setCollections] = useState<Collection | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsloading] = useState(false)

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

  return (
    <div>Collections Page</div>
  )
}

export default CollectionsPage