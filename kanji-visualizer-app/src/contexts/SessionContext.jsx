import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const SESSION_KEY = "kanji_study_session";

const defaultSession = {
  kanjiList: [],
  detailsList: [],
  currentIndex: 0,
  currentStep: 0,
  correctCount: 0,
  totalCount: 5,
  active: false,
  completed: false,
  ready: false,
  date: null,
  quizResults: [],
};

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [session, setSession] = useState(defaultSession);

  // Load from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      setSession(JSON.parse(data));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session]);

  // API
  const startSession = useCallback((kanjiList, detailsList) => {
    setSession((currentSession) => {
      const today = new Date().toISOString().slice(0, 10);
      const sessionDate = currentSession.date || today;

      // If this is the same session from today, preserve progress
      if (
        currentSession.ready &&
        sessionDate === today &&
        currentSession.kanjiList.length === kanjiList.length &&
        currentSession.kanjiList.every((k, i) => k === kanjiList[i])
      ) {
        return {
          ...currentSession,
          detailsList,
          active: true,
          ready: true,
        };
      }

      // New session or different day - reset progress
      return {
        kanjiList,
        detailsList,
        currentIndex: 0,
        currentStep: 0,
        correctCount: 0,
        totalCount: kanjiList.length,
        active: true,
        completed: false,
        ready: true,
        date: today,
        quizResults: [],
      };
    });
  }, []);

  const continueSession = useCallback(() => {
    setSession((s) => ({ ...s, active: true }));
  }, []);

  const updateSessionProgress = useCallback((currentIndex, correctCount) => {
    setSession((s) => ({ ...s, currentIndex, correctCount }));
  }, []);

  const updateSessionStep = useCallback((currentIndex, currentStep) => {
    setSession((s) => ({ ...s, currentIndex, currentStep }));
  }, []);

  const updateQuizResults = useCallback((quizResults) => {
    setSession((s) => ({ ...s, quizResults }));
  }, []);

  const completeSession = useCallback(() => {
    setSession((s) => ({ ...s, active: false, completed: true }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(defaultSession);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        startSession,
        continueSession,
        updateSessionProgress,
        updateSessionStep,
        updateQuizResults,
        completeSession,
        resetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
