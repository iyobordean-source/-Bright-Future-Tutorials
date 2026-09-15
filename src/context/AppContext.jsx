import { createContext, useContext, useMemo, useState } from 'react'
import { sampleStudents } from '../data/sampleStudents'

const AppContext = createContext(null)

// Demo-only credentials. Firebase auth will replace this later.
export const DEMO_ADMIN_EMAIL = 'admin@brightfuture.ng'
export const DEMO_ADMIN_PASSWORD = 'admin123'

let nextIdNumber = 1011

export function AppProvider({ children }) {
  const [students, setStudents] = useState(sampleStudents)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  const addStudent = (formData) => {
    const newStudent = {
      id: `BFT-${nextIdNumber++}`,
      ...formData,
      registrationDate: new Date().toISOString().slice(0, 10),
      paymentStatus: 'Pending',
      isNewRegistration: true,
    }
    setStudents((prev) => [newStudent, ...prev])
    return newStudent
  }

  const markAsPaid = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, paymentStatus: 'Paid' } : s))
    )
  }

  const login = (email, password) => {
    if (email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => setIsAdminAuthenticated(false)

  const value = useMemo(
    () => ({
      students,
      addStudent,
      markAsPaid,
      isAdminAuthenticated,
      login,
      logout,
    }),
    [students, isAdminAuthenticated]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
