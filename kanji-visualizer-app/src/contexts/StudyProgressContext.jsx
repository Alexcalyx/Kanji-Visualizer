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
} from "../services/studyProgressService";

const StudyProgressContext = createContext();

export function StudyProgressProvider({ children }) {
  const [progress, setProgress] = useState({});
  const [currentGrade, setCurrentGradeState] = useState("1");

  // Initialize state from async service
  useEffect(() => {
    (async () => {
      const prog = await loadProgressService();
      setProgress(prog);
      const grade = await getCurrentGradeService();
      setCurrentGradeState(grade);
    })();
  }, []);

  // Sync with localStorage changes (in case of multiple tabs)
  useEffect(() => {
    const handler = async () => {
      const prog = await loadProgressService();
      setProgress(prog);
      const grade = await getCurrentGradeService();
      setCurrentGradeState(grade);
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

  const value = {
    progress,
    markLearned,
    unmarkLearned,
    resetProgress,
    getLearnedKanjiForGrade,
    isKanjiLearned,
    currentGrade,
    setCurrentGrade,
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
