import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  loadProgress as loadProgressService,
  saveProgress as saveProgressService,
  markLearned as markLearnedService,
  unmarkLearned as unmarkLearnedService,
  resetProgress as resetProgressService,
  getLearnedKanjiForGrade as getLearnedKanjiForGradeService,
  getCurrentGrade as getCurrentGradeService,
  setCurrentGrade as setCurrentGradeService,
  // Session progress functions
  getSessionProgress as getSessionProgressService,
  saveSessionProgress as saveSessionProgressService,
  isSessionInProgress as isSessionInProgressService,
  resetSessionProgress as resetSessionProgressService,
  getSessionStats as getSessionStatsService,
  markKanjiCompleted as markKanjiCompletedService,
  updateSessionStep as updateSessionStepService,
} from "../services/studyProgressService";

const StudyProgressContext = createContext();

export function StudyProgressProvider({ children }) {
  const [progress, setProgress] = useState({});
  const [currentGrade, setCurrentGradeState] = useState("1");

  // Session progress state
  const [sessionProgress, setSessionProgressState] = useState(null);
  const [sessionStats, setSessionStatsState] = useState(null);
  const [isSessionInProgress, setIsSessionInProgressState] = useState(false);

  // Initialize state from async service
  useEffect(() => {
    (async () => {
      const prog = await loadProgressService();
      setProgress(prog);
      const grade = await getCurrentGradeService();
      setCurrentGradeState(grade);

      // Initialize session progress
      const sessionProg = await getSessionProgressService();
      setSessionProgressState(sessionProg);

      const sessionInProg = await isSessionInProgressService();
      setIsSessionInProgressState(sessionInProg);

      const stats = await getSessionStatsService();
      setSessionStatsState(stats);
    })();
  }, []);

  // Sync with localStorage changes (in case of multiple tabs)
  useEffect(() => {
    const handler = async () => {
      const prog = await loadProgressService();
      setProgress(prog);
      const grade = await getCurrentGradeService();
      setCurrentGradeState(grade);

      // Sync session progress
      const sessionProg = await getSessionProgressService();
      setSessionProgressState(sessionProg);

      const sessionInProg = await isSessionInProgressService();
      setIsSessionInProgressState(sessionInProg);

      const stats = await getSessionStatsService();
      setSessionStatsState(stats);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Helper to update state after service call
  const refresh = useCallback(async () => {
    const prog = await loadProgressService();
    setProgress(prog);
    const grade = await getCurrentGradeService();
    setCurrentGradeState(grade);

    // Refresh session progress
    const sessionProg = await getSessionProgressService();
    setSessionProgressState(sessionProg);

    const sessionInProg = await isSessionInProgressService();
    setIsSessionInProgressState(sessionInProg);

    const stats = await getSessionStatsService();
    setSessionStatsState(stats);
  }, []);

  const markLearned = useCallback(
    async (kanji, grade) => {
      await markLearnedService(kanji, grade);
      await refresh();
    },
    [refresh]
  );

  const unmarkLearned = useCallback(
    async (kanji, grade) => {
      await unmarkLearnedService(kanji, grade);
      await refresh();
    },
    [refresh]
  );

  const resetProgress = useCallback(
    async (grade) => {
      await resetProgressService(grade);
      await refresh();
    },
    [refresh]
  );

  const getLearnedKanjiForGrade = useCallback(async (grade) => {
    return await getLearnedKanjiForGradeService(grade);
  }, []);

  const setCurrentGrade = useCallback(async (grade) => {
    await setCurrentGradeService(grade);
    setCurrentGradeState(grade);
  }, []);

  const isKanjiLearned = useCallback(
    (kanji, grade) => {
      return (progress[grade] || []).includes(kanji);
    },
    [progress]
  );

  // Session progress methods
  const saveSessionProgress = useCallback(
    async (progressData) => {
      await saveSessionProgressService(progressData);
      await refresh();
    },
    [refresh]
  );

  const resetSessionProgress = useCallback(async () => {
    await resetSessionProgressService();
    await refresh();
  }, [refresh]);

  const markKanjiCompleted = useCallback(
    async (kanji, correct, step = 3) => {
      await markKanjiCompletedService(kanji, correct, step);
      await refresh();
    },
    [refresh]
  );

  const updateSessionStep = useCallback(
    async (currentIndex, currentStep) => {
      await updateSessionStepService(currentIndex, currentStep);
      await refresh();
    },
    [refresh]
  );

  const value = {
    progress,
    markLearned,
    unmarkLearned,
    resetProgress,
    getLearnedKanjiForGrade,
    isKanjiLearned,
    currentGrade,
    setCurrentGrade,
    // Session progress
    sessionProgress,
    sessionStats,
    isSessionInProgress,
    saveSessionProgress,
    resetSessionProgress,
    markKanjiCompleted,
    updateSessionStep,
  };

  return (
    <StudyProgressContext.Provider value={value}>
      {children}
    </StudyProgressContext.Provider>
  );
}

export function useStudyProgress() {
  const ctx = useContext(StudyProgressContext);
  if (!ctx)
    throw new Error(
      "useStudyProgress must be used within a StudyProgressProvider"
    );
  return ctx;
}
