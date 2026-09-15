import { Link } from 'react-router-dom'
import {
  ClipboardList,
  FolderCheck,
  Wallet,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Home.css'

const features = [
  {
    icon: ClipboardList,
    title: 'Easy student registration',
    description:
      'Parents fill a short form with their child\u2019s details, subjects and preferred class format \u2014 no paperwork, no back-and-forth.',
  },
  {
    icon: FolderCheck,
    title: 'Organized student records',
    description:
      'Every student\u2019s class, subjects and contact details live in one place, so nothing is scribbled on loose sheets of paper.',
  },
  {
    icon: Wallet,
    title: 'Payment tracking',
    description:
      'See at a glance who has paid and who hasn\u2019t, so following up on fees no longer depends on memory.',
  },
  {
    icon: MessageCircle,
    title: 'Better communication with parents',
    description:
      'Accurate phone numbers and records on file mean the centre can reach parents quickly when it matters.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Register the student',
    description: 'A parent or guardian submits the short registration form in under two minutes.',
  },
  {
    number: '02',
    title: 'We review and reach out',
    description: 'The centre reviews the details and contacts the parent to confirm subjects and schedule.',
  },
  {
    number: '03',
    title: 'Classes begin',
    description: 'The student is added to the class register and lessons start on the agreed date.',
  },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <h1>Give Your Child the Support They Need to Succeed.</h1>
              <p className="hero-sub">
                Bright Future Tutorials helps students prepare for exams and improve academically,
                with structured lessons, dedicated tutors, and a tutorial centre that keeps every
                family in the loop.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary">
                  Register a Student
                </Link>
                <Link to="/admin/login" className="btn btn-secondary">
                  Admin Login
                </Link>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="report-card">
                <div className="report-card-head">
                  <span className="report-card-label">Student Record</span>
                  <span className="badge badge-paid">Paid</span>
                </div>
                <p className="report-card-name">Chiamaka O.</p>
                <p className="report-card-level">SS2 &middot; In-Center</p>
                <ul className="report-card-subjects">
                  <li>
                    <span>Physics</span>
                    <CheckCircle2 size={16} />
                  </li>
                  <li>
                    <span>Chemistry</span>
                    <CheckCircle2 size={16} />
                  </li>
                  <li>
                    <span>Biology</span>
                    <CheckCircle2 size={16} />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <div className="features-grid">
              {features.map((f) => (
                <div className="feature-card" key={f.title}>
                  <span className="feature-icon">
                    <f.icon size={20} strokeWidth={2} />
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2>How registration works</h2>
            <div className="steps-grid">
              {steps.map((s) => (
                <div className="step-card" key={s.number}>
                  <span className="step-number">{s.number}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container cta-band-inner">
            <div>
              <h2>Ready to register a student?</h2>
              <p>It takes less than two minutes to submit a registration.</p>
            </div>
            <Link to="/register" className="btn btn-primary">
              Register a Student
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
