// studyProgressService.js
// Abstracts user study progress storage. Uses localStorage for now, but can be swapped for DB later.

const STORAGE_KEY = "kanji_study_progress";
const CURRENT_GRADE_KEY = "kanji_study_current_grade";
const DAILY_SESSION_KEY = "kanji_study_daily_session";
const SESSION_PROGRESS_KEY = "kanji_study_session_progress";
const KANJI_DETAILS_KEY = "kanji_study_details_cache"; // { [date]: { [kanji]: details } }

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// --- Progress ---
export async function loadProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export async function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export async function markLearned(kanji, grade) {
  const progress = await loadProgress();
  if (!progress[grade]) progress[grade] = [];
  if (!progress[grade].includes(kanji)) progress[grade].push(kanji);
  await saveProgress(progress);
}

export async function unmarkLearned(kanji, grade) {
  const progress = await loadProgress();
  if (progress[grade]) {
    progress[grade] = progress[grade].filter((k) => k !== kanji);
    await saveProgress(progress);
  }
}

export async function resetProgress(grade) {
  const progress = await loadProgress();
  if (progress[grade]) {
    progress[grade] = [];
    await saveProgress(progress);
  }
}

export async function getLearnedKanjiForGrade(grade) {
  const progress = await loadProgress();
  return progress[grade] || [];
}

export async function getCurrentGrade() {
  try {
    const grade = localStorage.getItem(CURRENT_GRADE_KEY);
    return grade || "1";
  } catch (e) {
    return "1";
  }
}

export async function setCurrentGrade(grade) {
  try {
    localStorage.setItem(CURRENT_GRADE_KEY, grade);
  } catch (e) {
    // Ignore
  }
}

// --- Daily Session ---
export async function getTodaySession() {
  try {
    const data = localStorage.getItem(DAILY_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export async function setTodaySession(kanjiList) {
  const today = getToday();
  const session = {
    date: today,
    kanji: kanjiList,
    progress: {
      currentIndex: 0,
      currentStep: 0,
      completedKanji: [],
      quizResults: [],
      sessionStarted: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    },
  };
  localStorage.setItem(DAILY_SESSION_KEY, JSON.stringify(session));
}

export async function clearTodaySession() {
  localStorage.removeItem(DAILY_SESSION_KEY);
  localStorage.removeItem(SESSION_PROGRESS_KEY);
}

export async function isTodaySessionAvailable() {
  const today = getToday();
  const session = await getTodaySession();
  return (
    session &&
    session.date === today &&
    Array.isArray(session.kanji) &&
    session.kanji.length === 5
  );
}

// --- Session Progress Tracking ---
export function getSessionProgress() {
  try {
    const data = localStorage.getItem(SESSION_PROGRESS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveSessionProgress(progress) {
  try {
    localStorage.setItem(SESSION_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {}
}

export function clearSessionProgress() {
  try {
    localStorage.removeItem(SESSION_PROGRESS_KEY);
  } catch (e) {}
}

export async function isSessionInProgress() {
  try {
    const session = await getTodaySession();
    const today = getToday();

    if (!session || session.date !== today) return false;

    const progress = session.progress;
    if (!progress) return false;

    // Session is in progress if:
    // 1. It's today's session
    // 2. Not all kanji are completed
    // 3. Has recent activity (within last 24 hours)
    const lastActivity = new Date(progress.lastActivity);
    const hoursSinceActivity =
      (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);

    return (
      progress.completedKanji.length < session.kanji.length &&
      hoursSinceActivity < 24
    );
  } catch (e) {
    return false;
  }
}

export async function resetSessionProgress() {
  try {
    const session = await getTodaySession();
    if (session) {
      session.progress = {
        currentIndex: 0,
        currentStep: 0,
        completedKanji: [],
        quizResults: [],
        sessionStarted: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      localStorage.setItem(DAILY_SESSION_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.warn("Failed to reset session progress:", e);
  }
}

export async function getSessionStats() {
  try {
    const session = await getTodaySession();
    const progress = session?.progress;

    if (!session || !progress) {
      return {
        totalKanji: 0,
        completedKanji: 0,
        currentIndex: 0,
        progressPercentage: 0,
        correctAnswers: 0,
        totalQuizzes: 0,
        sessionDuration: 0,
      };
    }

    const totalKanji = session.kanji.length;
    const completedKanji = progress.completedKanji.length;
    const correctAnswers = progress.quizResults.filter((r) => r.correct).length;
    const totalQuizzes = progress.quizResults.length;

    const sessionStart = new Date(progress.sessionStarted);
    const sessionDuration = Math.floor(
      (Date.now() - sessionStart.getTime()) / (1000 * 60)
    ); // minutes

    return {
      totalKanji,
      completedKanji,
      currentIndex: progress.currentIndex,
      progressPercentage: Math.round((completedKanji / totalKanji) * 100),
      correctAnswers,
      totalQuizzes,
      sessionDuration,
      accuracy:
        totalQuizzes > 0
          ? Math.round((correctAnswers / totalQuizzes) * 100)
          : 0,
    };
  } catch (e) {
    return {
      totalKanji: 0,
      completedKanji: 0,
      currentIndex: 0,
      progressPercentage: 0,
      correctAnswers: 0,
      totalQuizzes: 0,
      sessionDuration: 0,
    };
  }
}

export async function markKanjiCompleted(kanji, correct, step = 3) {
  try {
    const session = await getTodaySession();
    if (!session) return;

    const progress = session.progress || {};

    // Add to completed kanji if not already there
    if (!progress.completedKanji.includes(kanji)) {
      progress.completedKanji.push(kanji);
    }

    // Add quiz result
    progress.quizResults.push({
      kanji,
      correct,
      timestamp: new Date().toISOString(),
      step,
    });

    // Update current index to next uncompleted kanji
    const nextIndex = session.kanji.findIndex(
      (k) => !progress.completedKanji.includes(k)
    );
    progress.currentIndex = nextIndex >= 0 ? nextIndex : session.kanji.length;
    progress.currentStep = 0;

    await saveSessionProgress(progress);
  } catch (e) {
    console.warn("Failed to mark kanji completed:", e);
  }
}

export async function updateSessionStep(currentIndex, currentStep) {
  try {
    await saveSessionProgress({ currentIndex, currentStep });
  } catch (e) {
    console.warn("Failed to update session step:", e);
  }
}

// --- Kanji Details Cache (per day) ---
export async function getKanjiDetails(kanji, date = getToday()) {
  try {
    const data = localStorage.getItem(KANJI_DETAILS_KEY);
    if (!data) return null;
    const cache = JSON.parse(data);
    return cache[date]?.[kanji] || null;
  } catch (e) {
    return null;
  }
}

export async function setKanjiDetails(kanji, details, date = getToday()) {
  let cache = {};
  try {
    const data = localStorage.getItem(KANJI_DETAILS_KEY);
    if (data) cache = JSON.parse(data);
  } catch (e) {}
  if (!cache[date]) cache[date] = {};
  cache[date][kanji] = details;
  localStorage.setItem(KANJI_DETAILS_KEY, JSON.stringify(cache));
}

export async function clearKanjiDetailsCache(date = getToday()) {
  try {
    const data = localStorage.getItem(KANJI_DETAILS_KEY);
    if (!data) return;
    const cache = JSON.parse(data);
    delete cache[date];
    localStorage.setItem(KANJI_DETAILS_KEY, JSON.stringify(cache));
  } catch (e) {}
}
