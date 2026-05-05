import { Link } from 'react-router'

import { ArrowLeft } from 'lucide-react'

import './VisitDetailPage.css'

const VisitDetailPage = () => {

  return (
    <section className="page">
      <div className="detail-page-header">
        <Link
          className="gold-link back-link"
          to="/visits"
        >
          <ArrowLeft size="0.8rem" /> Back to Visits
        </Link>
        <h1 className="visit-detail-title"></h1>
      </div>
    </section>
  )
}

export default VisitDetailPage