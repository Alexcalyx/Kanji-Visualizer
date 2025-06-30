// studyProgressService.js
// Abstracts user study progress storage. Uses localStorage for now, but can be swapped for DB later.

const STORAGE_KEY = "kanji_study_progress";
const CURRENT_GRADE_KEY = "kanji_study_current_grade";
const DAILY_SESSION_KEY = "kanji_study_daily_session";

function loadProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    // Ignore
  }
}

export function getProgress() {
  return loadProgress();
}

export function setProgress(progress) {
  saveProgress(progress);
}

export function markLearned(kanji, grade) {
  const progress = loadProgress();
  if (!progress[grade]) progress[grade] = [];
  if (!progress[grade].includes(kanji)) progress[grade].push(kanji);
  saveProgress(progress);
}

export function unmarkLearned(kanji, grade) {
  const progress = loadProgress();
  if (progress[grade]) {
    progress[grade] = progress[grade].filter((k) => k !== kanji);
    saveProgress(progress);
  }
}

export function resetProgress(grade) {
  const progress = loadProgress();
  if (progress[grade]) {
    progress[grade] = [];
    saveProgress(progress);
  }
}

export function getLearnedKanjiForGrade(grade) {
  const progress = loadProgress();
  return progress[grade] || [];
}

export function getCurrentGrade() {
  try {
    const grade = localStorage.getItem(CURRENT_GRADE_KEY);
    return grade || "1";
  } catch (e) {
    return "1";
  }
}

export function setCurrentGrade(grade) {
  try {
    localStorage.setItem(CURRENT_GRADE_KEY, grade);
  } catch (e) {
    // Ignore
  }
}

export function getTodaySession() {
  try {
    const data = localStorage.getItem(DAILY_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function setTodaySession(kanjiList) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const session = { date: today, kanji: kanjiList };
  localStorage.setItem(DAILY_SESSION_KEY, JSON.stringify(session));
}

export function clearTodaySession() {
  localStorage.removeItem(DAILY_SESSION_KEY);
}

export function isTodaySessionAvailable() {
  const today = new Date().toISOString().slice(0, 10);
  const session = getTodaySession();
  return (
    session &&
    session.date === today &&
    Array.isArray(session.kanji) &&
    session.kanji.length === 5
  );
}
