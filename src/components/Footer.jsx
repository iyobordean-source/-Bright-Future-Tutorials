import { GraduationCap } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">
            <GraduationCap size={18} strokeWidth={2.25} />
          </span>
          <span>Bright Future Tutorials</span>
        </div>
        <p className="footer-tagline">
          Helping students in Benin City and beyond prepare for exams and improve academically.
        </p>
        <p className="footer-meta">
          &copy; {new Date().getFullYear()} Bright Future Tutorials. Demo application — no real payments are processed.
        </p>
      </div>
    </footer>
  )
}
