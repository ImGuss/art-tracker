import { NavLink, useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const location= useLocation()
  
  const { user, logout } = useAuth()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <header>
      <nav className="navbar">
        <div className="nav-logo-container">
          <NavLink to="/"><span className="title gold">Docently</span></NavLink>
        </div>

        <div className="nav-links-container">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/artists">Artists</NavLink>
          <NavLink to="/artworks">Artworks</NavLink>
          <NavLink to="/museums">Museums</NavLink>
          {user && <NavLink to="/visits">Visits</NavLink> }
          {user && <NavLink to="/collections">Collections</NavLink> }
        </div>

        {
          user ?
          <div className="nav-profile-container">
            <p>Hello, {user.username}</p>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div> :
          <div className="nav-profile-container">
            <NavLink to="/login"><span className="gold">Login</span></NavLink>
            <NavLink to="/register"><span className="gold">Register</span></NavLink>
          </div>
        }

        <button
          className="burger-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {
        isMenuOpen ?
        <div className="mobile-drawer">
          <div className="drawer-nav-links">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/artists">Artists</NavLink>
            <NavLink to="/artworks">Artworks</NavLink>
            <NavLink to="/museums">Museums</NavLink>
            {user && <NavLink to="/visits">Visits</NavLink> }
            {user && <NavLink to="/collections">Collections</NavLink> }
            {user ? null : <NavLink to="/login">Login</NavLink>}
            {user ? null: <NavLink to="/register" className="last">Register</NavLink>}
          </div>

          {
            user ?
            <div className="nav-profile-mobile">
              <p>Hello, {user.username}</p>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div> : null
          }
        </div> : null
      }
    </header>
  )

}

export default Navbar