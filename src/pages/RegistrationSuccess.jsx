import { Link, useLocation, Navigate } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './RegistrationSuccess.css'

export default function RegistrationSuccess() {
  const location = useLocation()
  const state = location.state

  if (!state) {
    return <Navigate to="/register" replace />
  }

  const { studentName, parentName } = state

  return (
    <>
      <Navbar />
      <main className="page-main success-page">
        <div className="container success-container">
          <div className="card success-card">
            <span className="success-icon">
              <PartyPopper size={26} strokeWidth={2} />
            </span>
            <h1>Registration Submitted Successfully 🎉</h1>
            <p>
              Thank you, {parentName}. Bright Future Tutorials has received {studentName}'s
              registration. Our team will call or message you within 24 hours to confirm subjects,
              schedule and fees.
            </p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
