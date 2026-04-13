import { Outlet } from 'react-router'

import '../styles/Layout.css'

import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )

}

export default Layout