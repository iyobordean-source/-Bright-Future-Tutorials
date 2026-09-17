import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp } from '../context/AppContext'
import { classLevels, academicTracks, subjectGroups, learningOptions } from '../data/sampleStudents'
import './Register.css'

const initialForm = {
  studentName: '',
  parentName: '',
  parentPhone: '',
  level: '',
  academicTrack: '',
  subjects: [],
  learningOption: '',
}

const PHONE_REGEX = /^0\d{10}$/

// Order matters here — it decides which field gets focus first on an
// invalid submit.
const FIELD_ORDER = [
  'studentName',
  'parentName',
  'parentPhone',
  'level',
  'academicTrack',
  'subjects',
  'learningOption',
]

function validate(form) {
  const errors = {}

  if (!form.studentName.trim()) {
    errors.studentName = 'Enter the student\u2019s full name.'
  } else if (form.studentName.trim().length < 3) {
    errors.studentName = 'Full name looks too short.'
  }

  if (!form.parentName.trim()) {
    errors.parentName = 'Enter the parent or guardian\u2019s name.'
  }

  if (!form.parentPhone.trim()) {
    errors.parentPhone = 'Enter a phone number.'
  } else if (!PHONE_REGEX.test(form.parentPhone.trim())) {
    errors.parentPhone = 'Enter a valid 11-digit Nigerian number, e.g. 08012345678.'
  }

  if (!form.level) {
    errors.level = 'Select the student\u2019s class.'
  }

  if (!form.academicTrack) {
    errors.academicTrack = 'Select an academic track.'
  }

  if (form.subjects.length === 0) {
    errors.subjects = 'Select at least one subject.'
  }

  if (!form.learningOption) {
    errors.learningOption = 'Choose a preferred learning option.'
  }

  return errors
}

export default function Register() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { addStudent } = useApp()
  const navigate = useNavigate()
  const fieldRefs = useRef({})

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSubject = (subject) => {
    setForm((prev) => {
      const has = prev.subjects.includes(subject)
      return {
        ...prev,
        subjects: has
          ? prev.subjects.filter((s) => s !== subject)
          : [...prev.subjects, subject],
      }
    })
  }

  const focusFirstError = (validationErrors) => {
    const firstField = FIELD_ORDER.find((field) => validationErrors[field])
    const node = firstField && fieldRefs.current[firstField]
    if (node) {
      node.focus({ preventScroll: false })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const student = await addStudent({
        studentName: form.studentName.trim(),
        parentName: form.parentName.trim(),
        parentPhone: form.parentPhone.trim(),
        level: form.level,
        academicTrack: form.academicTrack,
        subjects: form.subjects,
        learningOption: form.learningOption,
      })

      navigate('/register/success', {
        state: { studentName: student.studentName, parentName: student.parentName },
      })
    } catch (err) {
      console.error('Failed to submit registration:', err)
      setSubmitError('We couldn\u2019t submit your registration. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="page-main register-page">
        <div className="container register-container">
          <div className="register-intro">
            <h1>Student Registration</h1>
            <p>
              Fill in your child's details below. Bright Future Tutorials will review the
              registration and contact you to confirm the schedule.
            </p>
          </div>

          <form className="card register-form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div className="alert-banner" role="alert">
                <AlertCircle size={16} />
                <span>{submitError}</span>
              </div>
            )}

            <div className={`field ${errors.studentName ? 'has-error' : ''}`}>
              <label htmlFor="studentName">Student Full Name</label>
              <input
                id="studentName"
                type="text"
                placeholder="e.g. Chiamaka Okafor"
                value={form.studentName}
                onChange={(e) => updateField('studentName', e.target.value)}
                ref={(el) => (fieldRefs.current.studentName = el)}
                aria-invalid={Boolean(errors.studentName)}
                aria-describedby={errors.studentName ? 'studentName-error' : undefined}
                disabled={submitting}
              />
              {errors.studentName && (
                <span className="field-error" id="studentName-error">
                  {errors.studentName}
                </span>
              )}
            </div>

            <div className={`field ${errors.parentName ? 'has-error' : ''}`}>
              <label htmlFor="parentName">Parent / Guardian Name</label>
              <input
                id="parentName"
                type="text"
                placeholder="e.g. Mrs. Ifeoma Okafor"
                value={form.parentName}
                onChange={(e) => updateField('parentName', e.target.value)}
                ref={(el) => (fieldRefs.current.parentName = el)}
                aria-invalid={Boolean(errors.parentName)}
                aria-describedby={errors.parentName ? 'parentName-error' : undefined}
                disabled={submitting}
              />
              {errors.parentName && (
                <span className="field-error" id="parentName-error">
                  {errors.parentName}
                </span>
              )}
            </div>

            <div className={`field ${errors.parentPhone ? 'has-error' : ''}`}>
              <label htmlFor="parentPhone">Parent Phone Number</label>
              <input
                id="parentPhone"
                type="tel"
                inputMode="numeric"
                placeholder="e.g. 08012345678"
                value={form.parentPhone}
                onChange={(e) => updateField('parentPhone', e.target.value.replace(/[^\d]/g, ''))}
                maxLength={11}
                ref={(el) => (fieldRefs.current.parentPhone = el)}
                aria-invalid={Boolean(errors.parentPhone)}
                aria-describedby={errors.parentPhone ? 'parentPhone-error' : 'parentPhone-hint'}
                disabled={submitting}
              />
              {errors.parentPhone ? (
                <span className="field-error" id="parentPhone-error">
                  {errors.parentPhone}
                </span>
              ) : (
                <span className="hint" id="parentPhone-hint">
                  We'll use this number to reach you about your child's classes.
                </span>
              )}
            </div>

            <div className={`field ${errors.level ? 'has-error' : ''}`}>
              <label htmlFor="level">Student Class</label>
              <select
                id="level"
                value={form.level}
                onChange={(e) => updateField('level', e.target.value)}
                ref={(el) => (fieldRefs.current.level = el)}
                aria-invalid={Boolean(errors.level)}
                aria-describedby={errors.level ? 'level-error' : undefined}
                disabled={submitting}
              >
                <option value="">Select class</option>
                {classLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.level && (
                <span className="field-error" id="level-error">
                  {errors.level}
                </span>
              )}
            </div>

            <div className={`field ${errors.academicTrack ? 'has-error' : ''}`}>
              <label id="academicTrack-label">Academic Track</label>
              <div
                className="radio-row radio-row-compact"
                role="radiogroup"
                aria-labelledby="academicTrack-label"
                aria-invalid={Boolean(errors.academicTrack)}
                aria-describedby={errors.academicTrack ? 'academicTrack-error' : undefined}
              >
                {academicTracks.map((track, index) => (
                  <label className="radio-tile radio-tile-compact" key={track}>
                    <input
                      type="radio"
                      name="academicTrack"
                      value={track}
                      checked={form.academicTrack === track}
                      onChange={(e) => updateField('academicTrack', e.target.value)}
                      ref={index === 0 ? (el) => (fieldRefs.current.academicTrack = el) : undefined}
                      disabled={submitting}
                    />
                    <strong>{track}</strong>
                  </label>
                ))}
              </div>
              {errors.academicTrack && (
                <span className="field-error" id="academicTrack-error">
                  {errors.academicTrack}
                </span>
              )}
            </div>

            <div className={`field ${errors.subjects ? 'has-error' : ''}`}>
              <label id="subjects-label">Subjects</label>
              <span className="hint">Select all subjects the student needs help with.</span>

              <div
                role="group"
                aria-labelledby="subjects-label"
                aria-invalid={Boolean(errors.subjects)}
                aria-describedby={errors.subjects ? 'subjects-error' : undefined}
              >
                {subjectGroups.map((group) => (
                  <div className="subject-group" key={group.label}>
                    <p className="subject-group-title">{group.label}</p>
                    <div className="checkbox-grid">
                      {group.subjects.map((subject) => (
                        <label className="check-tile" key={subject}>
                          <input
                            type="checkbox"
                            checked={form.subjects.includes(subject)}
                            onChange={() => toggleSubject(subject)}
                            disabled={submitting}
                          />
                          {subject}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors.subjects && (
                <span className="field-error" id="subjects-error">
                  {errors.subjects}
                </span>
              )}
            </div>

            <div className={`field ${errors.learningOption ? 'has-error' : ''}`}>
              <label id="learningOption-label">Preferred Learning Option</label>
              <div
                className="radio-row"
                role="radiogroup"
                aria-labelledby="learningOption-label"
                aria-invalid={Boolean(errors.learningOption)}
                aria-describedby={errors.learningOption ? 'learningOption-error' : undefined}
              >
                {learningOptions.map((option, index) => (
                  <label className="radio-tile" key={option.value}>
                    <input
                      type="radio"
                      name="learningOption"
                      value={option.value}
                      checked={form.learningOption === option.value}
                      onChange={(e) => updateField('learningOption', e.target.value)}
                      ref={
                        index === 0 ? (el) => (fieldRefs.current.learningOption = el) : undefined
                      }
                      disabled={submitting}
                    />
                    <span>
                      <strong>{option.label}</strong>
                      <span className="radio-desc">{option.description}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.learningOption && (
                <span className="field-error" id="learningOption-error">
                  {errors.learningOption}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin-icon" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                'Submit Registration'
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}