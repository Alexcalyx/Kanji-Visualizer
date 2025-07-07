import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Play, Loader2 } from "lucide-react";
import ConfettiBurst from "../common/ConfettiBurst";

function playAudio(audioObj, audioId, setPlayingAudio) {
  // Try mp3, ogg, aac, opus in order
  const src = audioObj?.mp3 || audioObj?.ogg || audioObj?.aac || audioObj?.opus;
  if (src) {
    setPlayingAudio(audioId);
    const audio = new window.Audio(src);

    audio.addEventListener("ended", () => {
      setPlayingAudio(null);
    });

    audio.addEventListener("error", () => {
      setPlayingAudio(null);
    });

    audio.play().catch(() => {
      setPlayingAudio(null);
    });
  }
}

// Placeholder for stroke order, examples, and quiz (to be replaced with real data/components)
function StrokeOrder({ kanji, strokeMp4Url, strokeSvgUrl }) {
  if (!strokeMp4Url && !strokeSvgUrl)
    return <div className="my-4">[No stroke order available]</div>;
  return (
    <div className="my-4 flex flex-col items-center">
      {strokeMp4Url ? (
        <video
          src={strokeMp4Url}
          poster={strokeSvgUrl || ""}
          className="w-32 h-32 lg:w-52 lg:h-52 border rounded bg-white shadow"
          controls
          aria-label={`Stroke order video for ${kanji}`}
        />
      ) : (
        <img
          src={strokeSvgUrl}
          alt={`Stroke order for ${kanji}`}
          className="w-32 h-32 lg:w-52 lg:h-52 border rounded bg-white shadow"
        />
      )}
    </div>
  );
}

function Quiz({ kanji, meaning, readings, onResult }) {
  // Simple multiple choice: guess meaning
  const options = [meaning, "Fake 1", "Fake 2", "Fake 3"].sort(
    () => Math.random() - 0.5
  );
  const [selected, setSelected] = useState(null);
  return (
    <div className="my-4 p-4">
      <div className="mb-4 font-semibold text-base sm:text-lg text-center">
        What is the meaning of{" "}
        <span className="text-2xl sm:text-3xl font-bold text-purple-700">
          {kanji}
        </span>
        ?
      </div>
      <div className="flex flex-col gap-2 sm:gap-3 mb-6">
        {options.map((opt) => (
          <button
            key={opt}
            className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 font-medium text-left transition-all duration-200 ease-in-out text-sm sm:text-base ${
              selected === opt
                ? "bg-purple-100 border-purple-400 text-purple-800 shadow-md scale-105"
                : "bg-white border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:shadow-sm"
            } focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={() => setSelected(opt)}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-6 p-3 sm:p-4 rounded-lg border-2">
          {selected === meaning ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <span className="text-green-600 font-bold text-base sm:text-lg">
                ✓ Correct!
              </span>
              <button
                className="px-4 sm:px-6 py-3 bg-green-500 text-white rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-green-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 active:scale-95 text-sm sm:text-base"
                onClick={() => onResult(selected === meaning)}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <span className="text-red-600 font-bold text-base sm:text-lg">
                ✗ Incorrect. The correct answer is {meaning}.
              </span>
              <button
                className="px-4 sm:px-6 py-3 bg-red-500 text-white rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-red-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 active:scale-95 text-sm sm:text-base"
                onClick={() => onResult(selected === meaning)}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DailyStudySession({
  kanjiList,
  kanjiDataList,
  onComplete,
  onMarkLearned,
  onProgressUpdate,
  onSessionStepUpdate,
  onQuizResultsUpdate,
  // Session progress props
  sessionProgress,
  onUpdateSessionStep,
  onMarkKanjiCompleted,
}) {
  // kanjiList: array of kanji characters (e.g., ['日', '月', ...])
  // kanjiDataList: array of { kanji, meaning, readings, ... } (same order as kanjiList)

  // Initialize state from session progress if available
  const [currentIdx, setCurrentIdx] = useState(
    sessionProgress?.currentIndex || 0
  );
  const [step, setStep] = useState(sessionProgress?.currentStep || 0); // 0: lesson, 1: stroke, 2: quiz, 3: mark learned
  const [results, setResults] = useState(sessionProgress?.quizResults || []); // {kanji, correct}
  const [showConfetti, setShowConfetti] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewKanji, setReviewKanji] = useState([]);
  const [tab, setTab] = useState("Breakdown"); // Tab state for the new layout
  const [playingAudio, setPlayingAudio] = useState(null); // Track which audio is playing

  // Update local state when sessionProgress changes (e.g., when navigating back)
  useEffect(() => {
    if (sessionProgress) {
      setCurrentIdx(sessionProgress.currentIndex || 0);
      setStep(sessionProgress.currentStep || 0);
      setResults(sessionProgress.quizResults || []);
    }
  }, [sessionProgress]);

  // Auto-save session progress when state changes
  useEffect(() => {
    if (onSessionStepUpdate) {
      onSessionStepUpdate(currentIdx, step);
    }
  }, [currentIdx, step, onSessionStepUpdate]);

  // Call onProgressUpdate only in useEffect, not in render or setState
  useEffect(() => {
    if (onProgressUpdate) {
      const correctCount = results.filter((r) => r && r.correct).length;
      onProgressUpdate(currentIdx, correctCount);
    }
    // eslint-disable-next-line
  }, [currentIdx, results]);

  // Update quiz results in session context
  useEffect(() => {
    if (onQuizResultsUpdate && results.length > 0) {
      onQuizResultsUpdate(results);
    }
  }, [results, onQuizResultsUpdate]);

  const total = kanjiList.length;
  const currentKanji = kanjiList[currentIdx];
  const currentData = kanjiDataList[currentIdx] || {};

  const goNextStep = () => setStep((s) => s + 1);
  const goNextKanji = () => {
    setStep(0);
    setCurrentIdx((i) => i + 1);
  };

  // Enhanced result handling with session progress
  const handleQuizResult = (correct) => {
    const newResults = [...results];
    newResults[currentIdx] = { kanji: kanjiList[currentIdx], correct };
    setResults(newResults);
    goNextStep();
  };

  const ENCOURAGEMENTS = [
    "Great job!",
    "You're on fire!",
    "Keep going!",
    "Amazing progress!",
    "You're mastering kanji!",
    "Fantastic work!",
    "You did it!",
    "Impressive!",
    "Excellent work!",
  ];

  if (currentIdx >= total && !reviewMode) {
    const correctCount = results.filter((r) => r.correct).length;
    const missed = results.filter((r) => !r.correct).map((r) => r.kanji);
    const encouragement =
      ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    return (
      <div className="text-center p-8">
        <ConfettiBurst trigger={true} />
        <h2 className="text-2xl font-bold mb-4">Session Complete!</h2>
        <div className="mb-4 text-lg font-semibold text-purple-700">
          {encouragement}
        </div>
        <div className="mb-4">You studied {total} kanji today.</div>
        <div className="mb-4">
          Quiz correct: {correctCount} / {total}
        </div>
        {/* Recap Table */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-2 py-1">Kanji</th>
                <th className="px-2 py-1">Meaning</th>
                <th className="px-2 py-1">Result</th>
              </tr>
            </thead>
            <tbody>
              {kanjiList.map((k, i) => (
                <tr key={k} className="border-t">
                  <td className="px-2 py-1 text-xl font-bold">{k}</td>
                  <td className="px-2 py-1">
                    {(kanjiDataList[i]?.meanings || [])[0] || ""}
                  </td>
                  <td className="px-2 py-1">
                    {results[i]?.correct ? (
                      <span className="text-green-600 font-semibold">✔</span>
                    ) : (
                      <span className="text-red-500 font-semibold">✗</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {missed.length > 0 && (
          <button
            className="mb-4 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-orange-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 active:scale-95"
            onClick={() => {
              setReviewMode(true);
              setReviewKanji(missed);
              setCurrentIdx(0);
              setStep(0);
              setResults([]);
            }}
          >
            Review Mistakes
          </button>
        )}
        <button
          className="px-8 py-3 bg-purple-500 text-white rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-purple-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95"
          onClick={onComplete}
        >
          Finish
        </button>
      </div>
    );
  }

  // Review mode: only quiz missed kanji
  if (reviewMode && currentIdx >= reviewKanji.length) {
    return (
      <div className="text-center p-8">
        <ConfettiBurst trigger={true} />
        <h2 className="text-2xl font-bold mb-4">Review Complete!</h2>
        <div className="mb-4">You've reviewed all missed kanji.</div>
        <button
          className="px-8 py-3 bg-purple-500 text-white rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-purple-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95"
          onClick={onComplete}
        >
          Finish
        </button>
      </div>
    );
  }

  // Use reviewKanji and kanjiDataList for review mode
  const displayKanji = reviewMode ? reviewKanji : kanjiList;
  const displayDataList = reviewMode
    ? reviewKanji.map((k) => kanjiDataList[kanjiList.indexOf(k)] || {})
    : kanjiDataList;
  const displayTotal = displayKanji.length;
  const displayCurrentIdx = reviewMode ? currentIdx : currentIdx;
  const displayCurrentKanji = displayKanji[displayCurrentIdx];
  const displayCurrentData = displayDataList[displayCurrentIdx] || {};

  // Readings display with audio
  const readingsOn = displayCurrentData.readings_on || [];
  const readingsKun = displayCurrentData.readings_kun || [];

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 bg-white/80 rounded-xl">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs sm:text-sm mb-1">
          <span>
            Kanji {displayCurrentIdx + 1} / {displayTotal}
          </span>
          <span>Step {step + 1} / 4</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{
              width: `${
                ((displayCurrentIdx + step / 4) / displayTotal) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Step Content */}
      {step === 0 && (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 sm:gap-6 min-h-0">
          {/* Left: Kanji Image and Info */}
          <div className="flex flex-col w-full md:w-[30%] md:flex-shrink-0 px-2 py-2 sm:py-4 gap-4 sm:gap-6 items-center md:items-start">
            {/* Large Kanji Character */}
            <div className="text-6xl sm:text-8xl md:text-9xl font-bold text-slate-800 mb-2 text-center md:text-left">
              {displayCurrentKanji}
            </div>
            {/* Meaning Section */}
            <div className="flex flex-col gap-1 w-full text-center md:text-left">
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                Meaning
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                {(displayCurrentData.meanings || []).join(", ") || "[meaning]"}
              </div>
            </div>
            {/* Radical Section with Hint */}
            {displayCurrentData.radical && (
              <div className="flex flex-col gap-1 w-full text-center md:text-left">
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Radical
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-lg sm:text-xl font-bold text-black">
                    {displayCurrentData.radical}
                  </span>
                  <span className="text-sm text-black">
                    {displayCurrentData.radical_meaning || "Radical"}
                  </span>
                </div>
                {displayCurrentData.hint && (
                  <div className="flex mt-1 justify-center md:justify-start">
                    <div className="border-l-4 border-purple-300 mr-3" />
                    <div>
                      <span className="block text-xs font-semibold text-purple-700 uppercase mb-0.5">
                        Hint
                      </span>
                      <span
                        className="text-sm sm:text-base text-black"
                        dangerouslySetInnerHTML={{
                          __html: displayCurrentData.hint,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Reading Section */}
            <div className="flex flex-col gap-1 w-full text-center md:text-left">
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                Reading
              </div>
              <div className="flex mt-1 justify-center md:justify-start">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2 items-baseline justify-center md:justify-start">
                    <span className="text-xs font-semibold text-purple-600 uppercase">
                      On'yomi
                    </span>
                    <span className="text-base sm:text-lg font-bold text-black">
                      {(displayCurrentData.readings_on || []).join("、 ") ||
                        "[none]"}
                    </span>
                  </div>
                  <div className="flex gap-2 items-baseline justify-center md:justify-start">
                    <span className="text-xs font-semibold text-purple-600 uppercase">
                      Kun'yomi
                    </span>
                    <span className="text-base sm:text-lg font-bold text-black">
                      {(displayCurrentData.readings_kun || []).join("、 ") ||
                        "[none]"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tab Bar and Tab Content */}
          <div className="flex flex-col flex-1 w-full md:w-[70%] min-h-0">
            {/* Row 1: Tab Names */}
            <div className="flex-shrink-0 h-10 sm:h-12 border-b border-slate-200">
              <div className="flex h-full">
                {["Breakdown", "Examples"].map((t) => (
                  <button
                    key={t}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold transition-colors border-b-2 -mb-px ${
                      t === tab
                        ? "border-purple-500 text-purple-700 bg-purple-50"
                        : "border-transparent text-slate-500 hover:text-purple-600"
                    }`}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 max-h-96 sm:max-h-none">
              {tab === "Breakdown" && (
                <div className="py-2 sm:py-4">
                  <div className="flex flex-col items-center gap-2">
                    <StrokeOrder
                      kanji={displayCurrentKanji}
                      strokeMp4Url={displayCurrentData.strokeMp4Url}
                      strokeSvgUrl={displayCurrentData.strokeSvgUrl}
                    />
                    {displayCurrentData.strokeImages &&
                      displayCurrentData.strokeImages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 justify-center">
                          {displayCurrentData.strokeImages.map(
                            (imgUrl, idx) => (
                              <img
                                key={idx}
                                src={imgUrl}
                                alt={`Stroke ${idx + 1}`}
                                className="h-8 w-8 sm:h-10 sm:w-10 border bg-white rounded"
                                loading="lazy"
                              />
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>
              )}
              {tab === "Examples" && (
                <div className="py-2 sm:py-4">
                  <div className="space-y-2 sm:space-y-3">
                    {(displayCurrentData.examples || []).length === 0 && (
                      <div className="text-slate-400 italic text-center py-4 text-sm sm:text-base">
                        No examples available.
                      </div>
                    )}
                    {(displayCurrentData.examples || []).map((ex) => (
                      <div
                        key={ex.id}
                        className="bg-slate-50 rounded-lg p-2 sm:p-3 border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="text-base sm:text-lg font-medium text-slate-800 break-words">
                            {ex.japanese}
                          </span>
                          {ex.audio &&
                            (ex.audio.mp3 ||
                              ex.audio.ogg ||
                              ex.audio.aac ||
                              ex.audio.opus) && (
                              <button
                                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95 cursor-pointer group ${
                                  playingAudio === ex.id
                                    ? "bg-purple-600 text-white"
                                    : "bg-purple-500 hover:bg-purple-600 text-white"
                                }`}
                                onClick={() =>
                                  playAudio(ex.audio, ex.id, setPlayingAudio)
                                }
                                aria-label={`Play audio for ${ex.japanese}`}
                                disabled={playingAudio === ex.id}
                                title={`Play pronunciation for "${ex.japanese}"`}
                              >
                                {playingAudio === ex.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Play size={14} className="ml-0.5" />
                                )}
                              </button>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 italic">
                          {ex.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Row 3: Next Button */}
            <div className="flex-shrink-0 pt-4 sm:pt-6">
              <button
                className="w-full px-4 sm:px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-purple-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                onClick={goNextStep}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="text-center p-4">
          <StrokeOrder
            kanji={displayCurrentKanji}
            strokeMp4Url={displayCurrentData.strokeMp4Url}
            strokeSvgUrl={displayCurrentData.strokeSvgUrl}
          />
          <button
            className="mt-4 px-4 sm:px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-purple-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            onClick={goNextStep}
          >
            Next
          </button>
        </div>
      )}
      {step === 2 && (
        <>
          <Quiz
            kanji={displayCurrentKanji}
            meaning={(displayCurrentData.meanings || [])[0] || "[meaning]"}
            readings={readingsOn.concat(readingsKun).join(", ")}
            onResult={(correct) => {
              handleQuizResult(correct);
              if (correct) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 1200);
              }
            }}
          />
          <ConfettiBurst trigger={showConfetti} />
        </>
      )}
      {step === 3 && (
        <div className="text-center p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              className="px-4 sm:px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-purple-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              onClick={() => {
                onMarkLearned(displayCurrentKanji);
                goNextKanji();
              }}
            >
              Mark as Learned & Next
            </button>
            <button
              className="px-4 sm:px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200 ease-in-out hover:bg-gray-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              onClick={() => setStep(0)}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

DailyStudySession.propTypes = {
  kanjiList: PropTypes.arrayOf(PropTypes.string).isRequired,
  kanjiDataList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onComplete: PropTypes.func,
  onMarkLearned: PropTypes.func.isRequired,
  onProgressUpdate: PropTypes.func,
  onSessionStepUpdate: PropTypes.func,
  onQuizResultsUpdate: PropTypes.func,
  sessionProgress: PropTypes.object,
  onUpdateSessionStep: PropTypes.func,
  onMarkKanjiCompleted: PropTypes.func,
};

export default DailyStudySession;
