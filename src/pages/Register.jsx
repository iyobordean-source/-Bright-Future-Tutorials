import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp } from '../context/AppContext'
import { classLevels, subjectOptions, learningOptions } from '../data/sampleStudents'
import './Register.css'

const initialForm = {
  studentName: '',
  parentName: '',
  parentPhone: '',
  level: '',
  subjects: [],
  learningOption: '',
}

const PHONE_REGEX = /^0\d{10}$/

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
    errors.level = 'Select the student\u2019s class or level.'
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
  const { addStudent } = useApp()
  const navigate = useNavigate()

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)
    const student = addStudent({
      studentName: form.studentName.trim(),
      parentName: form.parentName.trim(),
      parentPhone: form.parentPhone.trim(),
      level: form.level,
      subjects: form.subjects,
      learningOption: form.learningOption,
    })

    navigate('/register/success', {
      state: { studentName: student.studentName, parentName: student.parentName },
    })
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
            <div className={`field ${errors.studentName ? 'has-error' : ''}`}>
              <label htmlFor="studentName">Student Full Name</label>
              <input
                id="studentName"
                type="text"
                placeholder="e.g. Chiamaka Okafor"
                value={form.studentName}
                onChange={(e) => updateField('studentName', e.target.value)}
              />
              {errors.studentName && <span className="field-error">{errors.studentName}</span>}
            </div>

            <div className={`field ${errors.parentName ? 'has-error' : ''}`}>
              <label htmlFor="parentName">Parent / Guardian Name</label>
              <input
                id="parentName"
                type="text"
                placeholder="e.g. Mrs. Ifeoma Okafor"
                value={form.parentName}
                onChange={(e) => updateField('parentName', e.target.value)}
              />
              {errors.parentName && <span className="field-error">{errors.parentName}</span>}
            </div>

            <div className={`field ${errors.parentPhone ? 'has-error' : ''}`}>
              <label htmlFor="parentPhone">Parent Phone Number</label>
              <input
                id="parentPhone"
                type="tel"
                placeholder="e.g. 08012345678"
                value={form.parentPhone}
                onChange={(e) => updateField('parentPhone', e.target.value.replace(/[^\d]/g, ''))}
                maxLength={11}
              />
              {errors.parentPhone ? (
                <span className="field-error">{errors.parentPhone}</span>
              ) : (
                <span className="hint">We'll use this number to reach you about your child's classes.</span>
              )}
            </div>

            <div className={`field ${errors.level ? 'has-error' : ''}`}>
              <label htmlFor="level">Student Class / Level</label>
              <select
                id="level"
                value={form.level}
                onChange={(e) => updateField('level', e.target.value)}
              >
                <option value="">Select class or level</option>
                {classLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.level && <span className="field-error">{errors.level}</span>}
            </div>

            <div className={`field ${errors.subjects ? 'has-error' : ''}`}>
              <label>Subjects</label>
              <span className="hint">Select all subjects the student needs help with.</span>
              <div className="checkbox-grid">
                {subjectOptions.map((subject) => (
                  <label className="check-tile" key={subject}>
                    <input
                      type="checkbox"
                      checked={form.subjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                    />
                    {subject}
                  </label>
                ))}
              </div>
              {errors.subjects && <span className="field-error">{errors.subjects}</span>}
            </div>

            <div className={`field ${errors.learningOption ? 'has-error' : ''}`}>
              <label>Preferred Learning Option</label>
              <div className="radio-row">
                {learningOptions.map((option) => (
                  <label className="radio-tile" key={option.value}>
                    <input
                      type="radio"
                      name="learningOption"
                      value={option.value}
                      checked={form.learningOption === option.value}
                      onChange={(e) => updateField('learningOption', e.target.value)}
                    />
                    <span>
                      <strong>{option.label}</strong>
                      <span className="radio-desc">{option.description}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.learningOption && <span className="field-error">{errors.learningOption}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              Submit Registration
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
