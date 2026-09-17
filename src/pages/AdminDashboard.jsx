import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Users,
  CircleDollarSign,
  Clock3,
  Sparkles,
  Search,
  LogOut,
  Eye,
  Loader2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import StudentModal from '../components/StudentModal'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { students, studentsLoading, logout, markAsPaid } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeStudent, setActiveStudent] = useState(null)
  const [markingPaidId, setMarkingPaidId] = useState(null)
  const [markPaidError, setMarkPaidError] = useState('')

  const stats = useMemo(() => {
    const total = students.length
    const paid = students.filter((s) => s.paymentStatus === 'Paid').length
    const pending = students.filter((s) => s.paymentStatus === 'Pending').length
    const newRegistrations = students.filter((s) => s.isNewRegistration).length
    return { total, paid, pending, newRegistrations }
  }, [students])

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => {
      const matchesQuery =
        !q ||
        s.studentName.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'All' || s.paymentStatus === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [students, query, statusFilter])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleMarkAsPaid = async (id) => {
    setMarkingPaidId(id)
    setMarkPaidError('')
    try {
      await markAsPaid(id)
      // The Firestore listener in AppContext will update `students` on its
      // own — this just keeps the open modal in sync immediately rather
      // than waiting for the round trip.
      setActiveStudent((prev) => (prev ? { ...prev, paymentStatus: 'Paid' } : prev))
    } catch (err) {
      console.error('Failed to mark student as paid:', err)
      setMarkPaidError('Could not update payment status. Please try again.')
    } finally {
      setMarkingPaidId(null)
    }
  }

  return (
    <div className="dashboard">
      <header className="dash-topbar">
        <div className="container dash-topbar-inner">
          <div className="dash-brand">
            <span className="brand-mark">
              <GraduationCap size={19} strokeWidth={2.25} />
            </span>
            <div>
              <p className="dash-brand-name">Bright Future Tutorials</p>
              <p className="dash-brand-sub">Admin Dashboard</p>
            </div>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
            <LogOut size={15} />
            Log Out
          </button>
        </div>
      </header>

      <main className="container dash-content">
        <div className="dash-heading">
          <h1>Students Overview</h1>
          <p>A quick summary of registrations and payments.</p>
        </div>

        {studentsLoading ? (
          <div className="dashboard-loading">
            <Loader2 size={26} className="spin-icon" aria-hidden="true" />
            <p>Loading students...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon stat-icon-navy">
                  <Users size={18} />
                </span>
                <p className="stat-value">{stats.total}</p>
                <p className="stat-label">Total Students</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon stat-icon-green">
                  <CircleDollarSign size={18} />
                </span>
                <p className="stat-value">{stats.paid}</p>
                <p className="stat-label">Paid Students</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon stat-icon-amber">
                  <Clock3 size={18} />
                </span>
                <p className="stat-value">{stats.pending}</p>
                <p className="stat-label">Pending Payments</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon stat-icon-gold">
                  <Sparkles size={18} />
                </span>
                <p className="stat-value">{stats.newRegistrations}</p>
                <p className="stat-label">New Registrations</p>
              </div>
            </div>

            <div className="table-card card">
              <div className="table-controls">
                <div className="search-input">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by student or parent name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  className="status-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by payment status"
                >
                  <option value="All">All payment statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="table-scroll">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Parent Name</th>
                      <th>Phone</th>
                      <th>Class</th>
                      <th>Subjects</th>
                      <th>Registered</th>
                      <th>Payment Status</th>
                      <th aria-hidden="true"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s.id}>
                        <td className="cell-name">{s.studentName}</td>
                        <td>{s.parentName}</td>
                        <td>{s.parentPhone}</td>
                        <td>{s.level}</td>
                        <td className="cell-subjects">{s.subjects.join(', ')}</td>
                        <td>
                          {new Date(s.registrationDate).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <span className={`badge ${s.paymentStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
                            {s.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setActiveStudent(s)}
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredStudents.length === 0 && (
                  <div className="table-empty">
                    <p>No students match your search or filter.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {activeStudent && (
        <StudentModal
          student={activeStudent}
          onClose={() => setActiveStudent(null)}
          onMarkAsPaid={handleMarkAsPaid}
          markingPaid={markingPaidId === activeStudent.id}
          markPaidError={markPaidError}
        />
      )}
    </div>
  )
}