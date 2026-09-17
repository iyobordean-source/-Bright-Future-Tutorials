import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ProtectedRoute({ children }) {
  const { authLoading, isAdminAuthenticated } = useApp()

  // Firebase reports the signed-in user asynchronously, even when a session
  // already exists (e.g. right after a page refresh). Without this check,
  // currentUser briefly reads as null on load and this would redirect an
  // already-logged-in admin straight back to the login page.
  if (authLoading) {
    return (
      <div className="route-loading">
        <Loader2 size={26} className="spin-icon" aria-hidden="true" />
        <p>Checking your session...</p>
      </div>
    )
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}