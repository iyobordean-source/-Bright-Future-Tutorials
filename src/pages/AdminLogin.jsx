import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '../context/AppContext'
import './AdminLogin.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password.')
      return
    }

    const success = login(email, password)
    if (success) {
      navigate('/admin/dashboard')
    } else {
      setError('Incorrect email or password. Try the demo credentials below.')
    }
  }

  return (
    <>
      <Navbar />
      <main className="page-main login-page">
        <div className="container login-container">
          <form className="card login-card" onSubmit={handleSubmit} noValidate>
            <span className="login-icon">
              <LockKeyhole size={22} strokeWidth={2} />
            </span>
            <h1>Admin Login</h1>
            <p className="login-sub">Sign in to manage student registrations and payments.</p>

            <div className={`field ${error ? 'has-error' : ''}`}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="admin@brightfuture.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={`field ${error ? 'has-error' : ''}`}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="········"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <span className="field-error">{error}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>

            <div className="demo-hint">
              <strong>Demo credentials</strong>
              <p>
                Email: <code>{DEMO_ADMIN_EMAIL}</code>
                <br />
                Password: <code>{DEMO_ADMIN_PASSWORD}</code>
              </p>
            </div>

            <Link to="/" className="back-link">
              &larr; Back to Home
            </Link>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
