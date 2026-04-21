import { Routes, Route } from 'react-router'

import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ArtistDetailPage from './pages/ArtistDetailPage'
import ArtistsPage from './pages/ArtistsPage'
import ArtworkDetailPage from './pages/ArtworkDetailPage'
import ArtworksPage from './pages/ArtworksPage'
import MuseumsPage from './pages/MuseumsPage'
import TagsPage from './pages/TagsPage'
import DashboardPage from './pages/DashboardPage'
import CollectionsPage from './pages/CollectionsPage'
import VisitsPage from './pages/VisitsPage'

import './App.css'

function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/artists/:id' element={<ArtistDetailPage />} />
        <Route path='/artists' element={<ArtistsPage />} />
        <Route path='/artworks/:id' element={<ArtworkDetailPage />} />
        <Route path='/artworks' element={<ArtworksPage />} />
        <Route path='/museums' element={<MuseumsPage />} />
        <Route path='/tags' element={<TagsPage />} />
        {/* PROTECTED ROUTES */}
        <Route path='/collections' element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />      
        <Route path='/visits' element={<ProtectedRoute><VisitsPage /></ProtectedRoute>} />
        {/* <Route path='*' element={<NotFoundPage />} /> */}
      </Route>
    </Routes>
  )
}

export default App
