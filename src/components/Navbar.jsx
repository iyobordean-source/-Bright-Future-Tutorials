import { Link, NavLink } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="site-nav">
      <div className="container site-nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <GraduationCap size={20} strokeWidth={2.25} />
          </span>
          <span className="brand-name">
            Bright Future <span>Tutorials</span>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
            Register a Student
          </NavLink>
          <Link to="/admin/login" className="btn btn-outline btn-sm">
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
