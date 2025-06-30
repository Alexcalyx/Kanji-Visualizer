// studyProgressService.js
// Abstracts user study progress storage. Uses localStorage for now, but can be swapped for DB later.

const STORAGE_KEY = "kanji_study_progress";
const CURRENT_GRADE_KEY = "kanji_study_current_grade";
const DAILY_SESSION_KEY = "kanji_study_daily_session";
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
  const session = { date: today, kanji: kanjiList };
  localStorage.setItem(DAILY_SESSION_KEY, JSON.stringify(session));
}

export async function clearTodaySession() {
  localStorage.removeItem(DAILY_SESSION_KEY);
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
