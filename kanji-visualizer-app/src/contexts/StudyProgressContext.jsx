import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  getProgress as getProgressService,
  setProgress as setProgressService,
  markLearned as markLearnedService,
  unmarkLearned as unmarkLearnedService,
  resetProgress as resetProgressService,
  getLearnedKanjiForGrade as getLearnedKanjiForGradeService,
  getCurrentGrade as getCurrentGradeService,
  setCurrentGrade as setCurrentGradeService,
  getStreakInfo,
  updateStreakOnSessionComplete,
} from "../services/studyProgressService";

const StudyProgressContext = createContext();

export function StudyProgressProvider({ children }) {
  const [progress, setProgress] = useState(getProgressService());
  const [currentGrade, setCurrentGradeState] = useState(
    getCurrentGradeService()
  );
  const [streakInfo, setStreakInfo] = useState(getStreakInfo());

  // Sync with localStorage changes (in case of multiple tabs)
  useEffect(() => {
    const handler = () => {
      setProgress(getProgressService());
      setCurrentGradeState(getCurrentGradeService());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Helper to update state after service call
  const refresh = useCallback(() => {
    setProgress(getProgressService());
    setCurrentGradeState(getCurrentGradeService());
  }, []);

  const markLearned = useCallback(
    (kanji, grade) => {
      markLearnedService(kanji, grade);
      refresh();
    },
    [refresh]
  );

  const unmarkLearned = useCallback(
    (kanji, grade) => {
      unmarkLearnedService(kanji, grade);
      refresh();
    },
    [refresh]
  );

  const resetProgress = useCallback(
    (grade) => {
      resetProgressService(grade);
      refresh();
    },
    [refresh]
  );

  const getLearnedKanjiForGrade = useCallback((grade) => {
    return getLearnedKanjiForGradeService(grade);
  }, []);

  const setCurrentGrade = useCallback((grade) => {
    setCurrentGradeService(grade);
    setCurrentGradeState(grade);
  }, []);

  // Add a function to update streak and state
  const completeDailySession = useCallback(() => {
    const newStreak = updateStreakOnSessionComplete();
    setStreakInfo(getStreakInfo());
    return newStreak;
  }, []);

  const value = {
    progress,
    markLearned,
    unmarkLearned,
    resetProgress,
    getLearnedKanjiForGrade,
    currentGrade,
    setCurrentGrade,
    streak: streakInfo.streak,
    lastStudyDate: streakInfo.lastStudyDate,
    completeDailySession,
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
