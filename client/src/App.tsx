import { useState } from 'react'
import { Routes, Route } from 'react-router'

import ArtistsPage from './pages/ArtistsPage'
import ArtworksPage from './pages/ArtworksPage'
import CollectionsPage from './pages/CollectionsPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import MuseumsPage from './pages/MuseumsPage'
import RegisterPage from './pages/RegisterPage'
import VisitsPage from './pages/VisitsPage'

import './App.css'

function App() {

  return (
    <Routes>
      <Route path='/' element={<DashboardPage />} />
      <Route path='/artists' element={<ArtistsPage />} />
      <Route path='/artworks' element={<ArtworksPage />} />
      <Route path='/collections' element={<CollectionsPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/museums' element={<MuseumsPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/visits' element={<VisitsPage />} />
      {/* <Route path='*' element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default App
