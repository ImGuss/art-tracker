import { Outlet } from 'react-router'

import '../styles/Layout.css'

import Navbar from './Navbar'

const Layout = () => {

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )

}

export default Layout