import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

const AppContext = createContext(null)

// The one account allowed into the admin dashboard, matched by email
// against whoever Firebase Auth reports as signed in (email/password or
// Google — either way works as long as the email matches).
export const ADMIN_EMAIL = 'iyobordean@gmail.com'

const googleProvider = new GoogleAuthProvider()

export function AppProvider({ children }) {
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(true)

  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Keep the signed-in user in sync with Firebase, including on page refresh.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setAuthLoading(false)
    })
    return unsubscribe
  }, [])

  // Live-sync the students collection so the dashboard, and any place that
  // reads `students`, always reflects Firestore without a manual refetch.
  useEffect(() => {
    const studentsQuery = query(collection(db, 'students'), orderBy('registrationDate', 'desc'))
    const unsubscribe = onSnapshot(
      studentsQuery,
      (snapshot) => {
        setStudents(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
        setStudentsLoading(false)
      },
      (error) => {
        console.error('Failed to load students from Firestore:', error)
        setStudentsLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const addStudent = async (formData) => {
    const newStudent = {
      ...formData,
      registrationDate: new Date().toISOString().slice(0, 10),
      paymentStatus: 'Pending',
      isNewRegistration: true,
    }
    await addDoc(collection(db, 'students'), newStudent)
    // The onSnapshot listener above will pick up the new document
    // automatically — we just return the submitted data for the
    // Registration Success page to use immediately.
    return newStudent
  }

  const markAsPaid = async (id) => {
    await updateDoc(doc(db, 'students', id), { paymentStatus: 'Paid' })
  }

  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email.trim(), password)
  }

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider)
  }

  const logout = () => signOut(auth)

  const isAdminAuthenticated =
    Boolean(currentUser) && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  const value = useMemo(
    () => ({
      students,
      studentsLoading,
      addStudent,
      markAsPaid,
      currentUser,
      authLoading,
      isAdminAuthenticated,
      loginWithEmail,
      loginWithGoogle,
      logout,
    }),
    [students, studentsLoading, currentUser, authLoading, isAdminAuthenticated]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}