import React, { useMemo, useEffect, useState } from "react";
import useKanjiList from "../hooks/useKanjiList";
import { useStudyProgress } from "../contexts/StudyProgressContext";
import DailyStudySession from "../components/kanji/DailyStudySession";
import useKanjiDetails from "../hooks/useKanjiDetails";
import { fetchKanjiDetails } from "../utils/fetchKanjiDetails";
import {
  getTodaySession,
  setTodaySession,
  isTodaySessionAvailable,
  clearTodaySession,
} from "../services/studyProgressService";

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
  } = useStudyProgress();
  const { kanjiList, isLoading, error } = useKanjiList(currentGrade);
  const learnedKanji = getLearnedKanjiForGrade(currentGrade);

  // --- Daily session state ---
  const [sessionKanji, setSessionKanji] = useState([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [detailsList, setDetailsList] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsErrors, setDetailsErrors] = useState([]);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // On mount or when kanjiList changes, set up today's session (not on learnedKanji)
  useEffect(() => {
    if (!kanjiList || kanjiList.length === 0) {
      setSessionKanji([]);
      setSessionReady(false);
      return;
    }
    const todaySession = getTodaySession();
    const today = new Date().toISOString().slice(0, 10);
    if (todaySession && todaySession.date === today) {
      setSessionKanji(todaySession.kanji);
      setSessionReady(true);
    } else {
      // Generate a new set of 5 unlearned kanji
      const dailyKanji = kanjiList
        .filter((k) => !learnedKanji.includes(k))
        .slice(0, 5);
      setTodaySession(dailyKanji);
      setSessionKanji(dailyKanji);
      setSessionReady(true);
    }
    setSessionCompleted(false); // Reset completion on new session
  }, [kanjiList]);

  // Watch for session completion (all 5 kanji learned)
  useEffect(() => {
    if (
      sessionKanji.length === 5 &&
      sessionKanji.every((k) => learnedKanji.includes(k))
    ) {
      setSessionCompleted(true);
      setSessionActive(false);
    }
  }, [learnedKanji, sessionKanji]);

  // Start session: use today's kanji
  const startSession = () => {
    setSessionActive(true);
  };

  // End session: reset sessionActive, but do not allow a new session today
  const handleSessionComplete = () => {
    setSessionActive(false);
    setSessionCompleted(true);
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

  // Retry loading details for failed kanji
  const retryFailedKanji = async () => {
    setDetailsLoading(true);
    setDetailsErrors([]);
    const failedKanji = sessionKanji.filter((k, i) => detailsList[i]?.error);
    const promises = failedKanji.map(async (k) => {
      try {
        return await fetchKanjiDetails(k);
      } catch (e) {
        return { error: e.message };
      }
    });
    const results = await Promise.all(promises);
    // Merge retried results into detailsList
    const newDetailsList = [...detailsList];
    failedKanji.forEach((k, idx) => {
      const i = sessionKanji.indexOf(k);
      if (i !== -1) newDetailsList[i] = results[idx];
    });
    setDetailsList(newDetailsList);
    setDetailsLoading(false);
    setDetailsErrors(
      newDetailsList.filter((r) => r && r.error).map((r) => r.error)
    );
  };

  // --- UI ---
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Study Center</h1>

      {/* Daily Study Section */}
      <section className="bg-white/70 rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Daily Study</h2>
        <p className="mb-4 text-gray-700">
          Get 5 new kanji from your current grade to study today.
        </p>
        {isLoading && <div>Loading kanji...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {detailsLoading && !isLoading && <div>Loading kanji details...</div>}
        {detailsErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <div className="font-bold text-red-700 mb-2">
              Some kanji details could not be loaded:
            </div>
            <ul className="list-disc pl-6 text-red-700 mb-2">
              {sessionKanji.map((k, i) =>
                detailsList[i]?.error ? (
                  <li key={k}>
                    <span className="font-semibold">{k}:</span>{" "}
                    {detailsList[i].error}
                    <div className="text-xs text-slate-700 mt-1">
                      {detailsList[i].error.includes("Network") ||
                      detailsList[i].error.includes("Failed to fetch")
                        ? "Check your internet connection or try again later."
                        : detailsList[i].error.includes("404") ||
                          detailsList[i].error
                            .toLowerCase()
                            .includes("not found")
                        ? "This kanji is not available in the database. You can skip it for now."
                        : detailsList[i].error.includes("429") ||
                          detailsList[i].error
                            .toLowerCase()
                            .includes("rate limit")
                        ? "API rate limit reached. Please wait a few minutes and try again."
                        : "Please try again or skip this kanji for now."}
                    </div>
                  </li>
                ) : null
              )}
            </ul>
            <button
              className="mt-2 px-4 py-2 bg-purple-500 text-white rounded font-semibold hover:bg-purple-600"
              onClick={retryFailedKanji}
              disabled={detailsLoading}
            >
              Retry Failed Kanji
            </button>
          </div>
        )}
        {!isLoading &&
          !error &&
          !detailsLoading &&
          sessionReady &&
          sessionKanji.length === 0 && (
            <div className="text-green-700 font-semibold">
              Congratulations! You have learned all kanji in this grade.
            </div>
          )}
        {!isLoading &&
          !error &&
          !detailsLoading &&
          sessionReady &&
          sessionKanji.length > 0 &&
          (sessionActive ? (
            <DailyStudySession
              kanjiList={sessionKanji}
              kanjiDataList={detailsList}
              onMarkLearned={(kanji) => markLearned(kanji, currentGrade)}
              onComplete={handleSessionComplete}
            />
          ) : sessionCompleted ? (
            <div className="text-purple-700 font-semibold text-lg">
              You've completed your 5 kanji for today! Come back tomorrow for
              more.
            </div>
          ) : (
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-semibold"
              onClick={startSession}
              disabled={sessionCompleted}
            >
              Start Daily Study
            </button>
          ))}
      </section>

      {/* Revision Mode Section */}
      <section className="bg-white/70 rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Revision Mode</h2>
        <div className="flex flex-col gap-4">
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-semibold">
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
