import { X, Phone, CalendarDays, BookOpen, Laptop, Loader2, AlertCircle } from 'lucide-react'
import './StudentModal.css'

export default function StudentModal({ student, onClose, onMarkAsPaid, markingPaid, markPaidError }) {
  if (!student) return null

  const formattedDate = new Date(student.registrationDate).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="modal-head">
          <p className="modal-id">{student.id}</p>
          <h2 id="student-modal-title">{student.studentName}</h2>
          <span className={`badge ${student.paymentStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
            {student.paymentStatus}
          </span>
        </div>

        <dl className="modal-details">
          <div className="modal-row">
            <dt>Parent / Guardian</dt>
            <dd>{student.parentName}</dd>
          </div>
          <div className="modal-row">
            <dt>
              <Phone size={14} /> Phone
            </dt>
            <dd>{student.parentPhone}</dd>
          </div>
          <div className="modal-row">
            <dt>Class / Level</dt>
            <dd>{student.level}</dd>
          </div>
          <div className="modal-row">
            <dt>
              <Laptop size={14} /> Learning Option
            </dt>
            <dd>{student.learningOption}</dd>
          </div>
          <div className="modal-row">
            <dt>
              <CalendarDays size={14} /> Registered
            </dt>
            <dd>{formattedDate}</dd>
          </div>
          <div className="modal-row modal-row-subjects">
            <dt>
              <BookOpen size={14} /> Subjects
            </dt>
            <dd>
              <div className="modal-subject-chips">
                {student.subjects.map((subject) => (
                  <span className="subject-chip" key={subject}>
                    {subject}
                  </span>
                ))}
              </div>
            </dd>
          </div>
        </dl>

        {markPaidError && (
          <div className="alert-banner" role="alert">
            <AlertCircle size={16} />
            <span>{markPaidError}</span>
          </div>
        )}

        {student.paymentStatus === 'Pending' && (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => onMarkAsPaid(student.id)}
            disabled={markingPaid}
          >
            {markingPaid ? (
              <>
                <Loader2 size={16} className="spin-icon" aria-hidden="true" />
                Marking as Paid...
              </>
            ) : (
              'Mark as Paid'
            )}
          </button>
        )}
      </div>
    </div>
  )
}