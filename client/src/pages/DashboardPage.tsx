import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

import { getUserVisits } from '../api/visitApi'
import { getUserCollections } from '../api/collectionApi'

import type { Visit } from '../types/visit'
import type { Collection } from '../types/collection'

const DashboardPage = () => {
  const { user } = useAuth()

  const [visits, setVisits] = useState<Visit[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      (async () => {
        const [visits, collections] = await Promise.all([getUserVisits(), getUserCollections()])
  
      })()
    } catch (err) {
      setError('Failed to get user data') 
    }
  }, [])

  if (!user) {
    // will work on logic for logged out user after logged in user logic
    return(
      <div>
        Dashboard Page
        <Link to="/login">Login</Link>
      </div>
    )
  }



  return (
    <div>{user.username}'s Dashboard</div>
  )
}

export default DashboardPage