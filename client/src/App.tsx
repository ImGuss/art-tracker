import { Routes, Route } from 'react-router'

import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ArtistsPage from './pages/ArtistsPage'
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
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/artists' element={<ArtistsPage />} />
      <Route path='/artworks' element={<ArtworksPage />} />
      <Route path='/museums' element={<MuseumsPage />} />
      <Route path='/tags' element={<TagsPage />} />
      {/* PROTECTED ROUTES */}
      <Route path='/' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path='/collections' element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />      
      <Route path='/visits' element={<ProtectedRoute><VisitsPage /></ProtectedRoute>} />
      {/* <Route path='*' element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default App
