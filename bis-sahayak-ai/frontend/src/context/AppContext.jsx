import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'bis-sahayak-session'

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveSession(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function AppProvider({ children }) {
  const saved = loadSession()

  const [userType, setUserType] = useState(saved?.userType || 'consumer')
  const [language, setLanguage] = useState(saved?.language || 'en')
  const [activity, setActivity] = useState(saved?.activity || [])
  const [complianceChecks, setComplianceChecks] = useState(saved?.complianceChecks || 0)
  const [questionsAsked, setQuestionsAsked] = useState(saved?.questionsAsked || 0)

  const persist = useCallback((updates) => {
    saveSession({
      userType,
      language,
      activity,
      complianceChecks,
      questionsAsked,
      ...updates,
    })
  }, [userType, language, activity, complianceChecks, questionsAsked])

  const updateUserType = (ut) => {
    setUserType(ut)
    persist({ userType: ut })
  }

  const updateLanguage = (lang) => {
    setLanguage(lang)
    persist({ language: lang })
  }

  const addActivity = useCallback((entry) => {
    setActivity((prev) => {
      const next = [
        {
          ...entry,
          timestamp: Date.now(),
          timeAgo: 'just now',
        },
        ...prev,
      ].slice(0, 20)
      persist({ activity: next })
      return next
    })
  }, [persist])

  const incrementCompliance = useCallback(() => {
    setComplianceChecks((prev) => {
      const next = prev + 1
      persist({ complianceChecks: next })
      return next
    })
  }, [persist])

  const incrementQuestions = useCallback(() => {
    setQuestionsAsked((prev) => {
      const next = prev + 1
      persist({ questionsAsked: next })
      return next
    })
  }, [persist])

  const clearActivity = useCallback(() => {
    setActivity([])
    persist({ activity: [] })
  }, [persist])

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType: updateUserType,
        language,
        setLanguage: updateLanguage,
        activity,
        addActivity,
        clearActivity,
        complianceChecks,
        incrementCompliance,
        questionsAsked,
        incrementQuestions,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
