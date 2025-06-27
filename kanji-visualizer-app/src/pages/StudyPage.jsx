import React, { useMemo, useEffect, useState } from "react";
import useKanjiList from "../hooks/useKanjiList";
import { useStudyProgress } from "../contexts/StudyProgressContext";
import DailyStudySession from "../components/kanji/DailyStudySession";
import useKanjiDetails from "../hooks/useKanjiDetails";
import { fetchKanjiDetails } from "../utils/fetchKanjiDetails";

const GRADE_OPTIONS = [
  { value: "1", label: "Grade 1" },
  { value: "2", label: "Grade 2" },
  { value: "3", label: "Grade 3" },
  { value: "4", label: "Grade 4" },
  { value: "5", label: "Grade 5" },
  { value: "6", label: "Grade 6" },
];

function StudyPage() {
  const {
    currentGrade,
    setCurrentGrade,
    getLearnedKanjiForGrade,
    markLearned,
    streak,
    lastStudyDate,
    completeDailySession,
  } = useStudyProgress();
  const { kanjiList, isLoading, error } = useKanjiList(currentGrade);
  const learnedKanji = getLearnedKanjiForGrade(currentGrade);

  // Get 5 unlearned kanji
  const dailyKanji = useMemo(() => {
    if (!kanjiList) return [];
    return kanjiList.filter((k) => !learnedKanji.includes(k)).slice(0, 5);
  }, [kanjiList, learnedKanji]);

  // Session kanji: fixed for the session
  const [sessionKanji, setSessionKanji] = useState([]);
  const [detailsList, setDetailsList] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsErrors, setDetailsErrors] = useState([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  // Start session: pick 5 kanji and store in sessionKanji
  const startSession = () => {
    setSessionKanji(dailyKanji);
    setSessionActive(true);
  };

  // End session: reset sessionKanji
  const handleSessionComplete = () => {
    const prevStreak = streak;
    const newStreak = completeDailySession();
    setSessionActive(false);
    setSessionKanji([]);
    if (newStreak > prevStreak) {
      setShowStreakCelebration(true);
      setTimeout(() => setShowStreakCelebration(false), 2500);
    }
  };

  // Fetch kanji details only for sessionKanji
  useEffect(() => {
    let cancelled = false;
    async function fetchAllDetails() {
      setDetailsLoading(true);
      setDetailsErrors([]);
      const promises = sessionKanji.map(async (k) => {
        try {
          return await fetchKanjiDetails(k);
        } catch (e) {
          return { error: e.message };
        }
      });
      const results = await Promise.all(promises);
      if (!cancelled) {
        setDetailsList(results);
        setDetailsLoading(false);
        setDetailsErrors(
          results.filter((r) => r && r.error).map((r) => r.error)
        );
      }
    }
    if (sessionActive && sessionKanji.length > 0) fetchAllDetails();
    else setDetailsList([]);
    return () => {
      cancelled = true;
    };
  }, [sessionActive, sessionKanji]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Study Center</h1>

      {/* Daily Streak Display */}
      <div className="flex justify-center items-center mb-6">
        <span className="text-lg font-semibold text-amber-600 mr-2">
          🔥 Daily Streak:
        </span>
        <span className="text-2xl font-bold text-amber-500">{streak}</span>
        {showStreakCelebration && (
          <span className="ml-3 text-3xl animate-bounce">🎉</span>
        )}
      </div>

      {/* Grade Selector */}
      <div className="flex justify-center mb-8">
        <label className="mr-3 font-semibold text-lg" htmlFor="grade-select">
          Select Grade:
        </label>
        <select
          id="grade-select"
          value={currentGrade}
          onChange={(e) => setCurrentGrade(e.target.value)}
          className="px-3 py-2 rounded border border-slate-300 text-lg"
        >
          {GRADE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Daily Study Section */}
      <section className="bg-white/70 rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Daily Study</h2>
        <p className="mb-4 text-gray-700">
          Get 5 new kanji from your current grade to study today.
        </p>
        {isLoading && <div>Loading kanji...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {detailsLoading && !isLoading && <div>Loading kanji details...</div>}
        {detailsErrors && detailsErrors.length > 0 && (
          <div className="text-red-500">
            Some kanji details could not be loaded.
          </div>
        )}
        {!isLoading && !error && !detailsLoading && dailyKanji.length === 0 && (
          <div className="text-green-700 font-semibold">
            Congratulations! You have learned all kanji in this grade.
          </div>
        )}
        {!isLoading &&
          !error &&
          !detailsLoading &&
          dailyKanji.length > 0 &&
          (sessionActive ? (
            <DailyStudySession
              kanjiList={sessionKanji}
              kanjiDataList={detailsList}
              onMarkLearned={(kanji) => markLearned(kanji, currentGrade)}
              onComplete={handleSessionComplete}
            />
          ) : (
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-semibold"
              onClick={startSession}
            >
              Start Daily Study
            </button>
          ))}
      </section>

      {/* Revision Mode Section */}
      <section className="bg-white/70 rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Revision Mode</h2>
        <div className="flex flex-col gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold">
            Quiz: Guess Kanji from Meaning/Reading
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-semibold">
            Quiz: Guess Meaning/Reading from Kanji
          </button>
        </div>
      </section>
    </div>
  );
}

export default StudyPage;
