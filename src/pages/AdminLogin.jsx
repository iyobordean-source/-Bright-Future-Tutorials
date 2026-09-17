import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LockKeyhole, Loader2, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp, ADMIN_EMAIL } from '../context/AppContext'
import './AdminLogin.css'

// Maps Firebase auth error codes to short, parent/owner-friendly messages
// instead of showing raw "Firebase: Error (auth/...)" text.
function friendlyAuthError(error) {
  const code = error?.code || ''
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return '' // user closed the Google popup themselves — not a real error
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    default:
      return 'Something went wrong signing in. Please try again.'
  }
}

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { loginWithEmail, loginWithGoogle, logout } = useApp()
  const navigate = useNavigate()

  const busy = emailLoading || googleLoading

  const enforceAdmin = async (user) => {
    if (user.email?.toLowerCase() === ADMIN_EMAIL) {
      navigate('/admin/dashboard')
      return
    }
    await logout()
    setError('This account is not authorized for admin access.')
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (busy) return

    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password.')
      return
    }

    setError('')
    setEmailLoading(true)
    try {
      const result = await loginWithEmail(email, password)
      await enforceAdmin(result.user)
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setEmailLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (busy) return
    setError('')
    setGoogleLoading(true)
    try {
      const result = await loginWithGoogle()
      await enforceAdmin(result.user)
    } catch (err) {
      const message = friendlyAuthError(err)
      if (message) setError(message)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="page-main login-page">
        <div className="container login-container">
          <form className="card login-card" onSubmit={handleEmailSubmit} noValidate>
            <span className="login-icon">
              <LockKeyhole size={22} strokeWidth={2} />
            </span>
            <h1>Admin Login</h1>
            <p className="login-sub">Sign in to manage student registrations and payments.</p>

            {error && (
              <div className="alert-banner" role="alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="········"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {emailLoading ? (
                <>
                  <Loader2 size={16} className="spin-icon" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="login-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-block google-btn"
              onClick={handleGoogleSignIn}
              disabled={busy}
            >
              {googleLoading ? (
                <Loader2 size={16} className="spin-icon" aria-hidden="true" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
                  />
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

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