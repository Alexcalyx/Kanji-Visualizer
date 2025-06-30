import React, { useEffect } from "react";
import useKanjiList from "../hooks/useKanjiList";
import { useStudyProgress } from "../contexts/StudyProgressContext";
import { useSession } from "../contexts/SessionContext";
import { DailyStudySession } from "../components/kanji";
import { fetchKanjiDetails } from "../utils/fetchKanjiDetails";
import {
  getTodaySession,
  setTodaySession,
  getKanjiDetails,
  setKanjiDetails,
} from "../services/studyProgressService";

function StudyPage() {
  const { currentGrade, isKanjiLearned, markLearned } = useStudyProgress();
  const { kanjiList, isLoading, error } = useKanjiList(currentGrade);
  const {
    session,
    startSession,
    continueSession,
    updateSessionProgress,
    updateSessionStep,
    updateQuizResults,
    completeSession,
    resetSession,
  } = useSession();

  // On mount or when kanjiList changes, set up today's session if not already ready
  useEffect(() => {
    const initializeSession = async () => {
      // Don't initialize if we already have a session
      if (session.ready && session.kanjiList.length > 0) return;

      // Don't initialize if we don't have kanji data yet
      if (!kanjiList || kanjiList.length === 0) return;

      // Get today's session or create new one
      const todaySession = await getTodaySession();
      const today = new Date().toISOString().slice(0, 10);

      let dailyKanji = [];
      if (todaySession && todaySession.date === today) {
        dailyKanji = todaySession.kanji;
      } else {
        dailyKanji = kanjiList
          .filter((k) => !isKanjiLearned(k, currentGrade))
          .slice(0, 5);
        await setTodaySession(dailyKanji);
      }

      // Fetch details for all kanji
      const detailsList = [];
      for (const k of dailyKanji) {
        let details = await getKanjiDetails(k);
        if (!details) {
          try {
            details = await fetchKanjiDetails(k);
            await setKanjiDetails(k, details);
          } catch (e) {
            details = { error: e.message };
            await setKanjiDetails(k, details);
          }
        }
        detailsList.push(details);
      }

      startSession(dailyKanji, detailsList);
    };

    initializeSession();
  }, [
    kanjiList,
    isKanjiLearned,
    currentGrade,
    session.ready,
    session.kanjiList.length,
    startSession,
  ]);

  // Watch for session completion
  useEffect(() => {
    if (
      session.kanjiList.length > 0 &&
      session.kanjiList.every((k) => isKanjiLearned(k, currentGrade))
    ) {
      completeSession();
    }
  }, [session.kanjiList, isKanjiLearned, currentGrade, completeSession]);

  // UI calculations
  const completed = session.currentIndex || 0;
  const correct = session.correctCount || 0;
  const total = session.totalCount || 5;
  const accuracy = completed > 0 ? Math.round((correct / completed) * 100) : 0;
  const buttonLabel = completed === 0 ? "Start Session" : "Continue Session";

  // Check for loading states
  const isDetailsLoading =
    session.ready &&
    session.kanjiList.length > 0 &&
    (session.detailsList.length !== session.kanjiList.length ||
      session.detailsList.some((d) => !d));

  const hasDetailsErrors = session.detailsList.some((d) => d?.error);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Study Center</h1>

      {/* Daily Study Section */}
      <section className="bg-white/70 rounded-xl shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Daily Study</h2>
        {!session.active && !session.completed && (
          <p className="mb-4 text-gray-700">
            Get 5 new kanji from your current grade to study today.
          </p>
        )}

        {/* Loading States */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-purple-700">Loading kanji...</p>
          </div>
        )}

        {error && <div className="text-red-500 text-center py-8">{error}</div>}

        {/* Session Card - Show when session is ready but not active */}
        {session.ready &&
          !session.completed &&
          session.kanjiList.length > 0 &&
          !session.active && (
            <div className="border border-purple-200 rounded-2xl bg-purple-50/60 p-6 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-purple-700">
                  Session in Progress
                </span>
                <span className="text-md font-semibold text-purple-600">
                  {completed}/{total} completed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-purple-200 rounded-full h-3 mb-6">
                <div
                  className="bg-purple-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((completed / total) * 100)}%` }}
                />
              </div>

              {/* Stats row */}
              <div className="flex justify-between text-center mb-6">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-purple-700">
                    {Math.round((completed / total) * 100)}%
                  </div>
                  <div className="text-purple-600 font-medium">Complete</div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-purple-700">
                    {accuracy}%
                  </div>
                  <div className="text-purple-600 font-medium">Accuracy</div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-purple-700">
                    {correct}/{completed}
                  </div>
                  <div className="text-purple-600 font-medium">Correct</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={continueSession}
                  className="flex-1 px-4 py-3 rounded-lg bg-purple-600 text-white text-lg font-bold shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {buttonLabel}
                </button>
                <button
                  onClick={resetSession}
                  className="px-8 py-3 rounded-lg bg-gray-50 text-gray-700 text-lg font-bold border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

        {/* Details Loading */}
        {isDetailsLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            <span className="ml-4 text-purple-700 font-medium">
              Loading session details...
            </span>
          </div>
        )}

        {/* Details Errors */}
        {hasDetailsErrors && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <div className="font-bold text-red-700 mb-2">
              Some kanji details could not be loaded:
            </div>
            <ul className="list-disc pl-6 text-red-700 mb-2">
              {session.kanjiList.map((k, i) =>
                session.detailsList[i]?.error ? (
                  <li key={k}>
                    <span className="font-semibold">{k}:</span>{" "}
                    {session.detailsList[i].error}
                  </li>
                ) : null
              )}
            </ul>
            <button
              className="mt-2 px-4 py-2 bg-purple-500 text-white rounded font-semibold hover:bg-purple-600"
              onClick={() => window.location.reload()}
            >
              Retry Failed Kanji
            </button>
          </div>
        )}

        {/* Active Study Session */}
        {session.active &&
          session.ready &&
          session.kanjiList.length > 0 &&
          !isDetailsLoading && (
            <DailyStudySession
              kanjiList={session.kanjiList}
              kanjiDataList={session.detailsList}
              onComplete={completeSession}
              onMarkLearned={(kanji) => markLearned(kanji, currentGrade)}
              onProgressUpdate={updateSessionProgress}
              onSessionStepUpdate={updateSessionStep}
              onQuizResultsUpdate={updateQuizResults}
              sessionProgress={{
                currentIndex: session.currentIndex,
                currentStep: session.currentStep || 0,
                quizResults: session.quizResults || [],
              }}
            />
          )}

        {/* All Kanji Learned */}
        {session.ready && session.kanjiList.length === 0 && (
          <div className="text-center py-8">
            <div className="text-purple-700 font-semibold text-lg">
              Congratulations! You have learned all kanji in this grade.
            </div>
          </div>
        )}

        {/* Session Completed */}
        {session.completed && (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">
              Session Completed!
            </h3>
            <p className="text-gray-600 mb-4">
              You've completed today's study session. Come back tomorrow for
              more kanji!
            </p>
          </div>
        )}
      </section>

      {/* Review Section */}
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
