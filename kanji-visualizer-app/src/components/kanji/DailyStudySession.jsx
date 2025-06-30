import React, { useState } from "react";
import PropTypes from "prop-types";
import ConfettiBurst from "../common/ConfettiBurst";

function playAudio(audioObj) {
  // Try mp3, ogg, aac, opus in order
  const src = audioObj?.mp3 || audioObj?.ogg || audioObj?.aac || audioObj?.opus;
  if (src) {
    const audio = new window.Audio(src);
    audio.play();
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
    <div className="my-4">
      <div className="mb-2 font-semibold">
        What is the meaning of <span className="text-2xl">{kanji}</span>?
      </div>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`px-4 py-2 rounded border ${
              selected === opt ? "bg-purple-200" : "bg-white"
            } hover:bg-purple-100`}
            onClick={() => setSelected(opt)}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-4">
          {selected === meaning ? (
            <span className="text-green-600 font-bold">Correct!</span>
          ) : (
            <span className="text-red-600 font-bold">
              Incorrect. The correct answer is {meaning}.
            </span>
          )}
          <button
            className="ml-4 px-3 py-1 bg-purple-500 text-white rounded"
            onClick={() => onResult(selected === meaning)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function TabSection({ kanji, data }) {
  const [tab, setTab] = React.useState("Breakdown");
  const tabs = ["Breakdown", "Meaning", "Reading", "Examples"];
  return (
    <div>
      {/* Tab Bar */}
      <div className="flex border-b border-slate-200 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            className={`px-4 py-2 font-semibold transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-purple-500 text-purple-700 bg-purple-50"
                : "border-transparent text-slate-500 hover:text-purple-600"
            }`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {tab === "Breakdown" && (
        <div className="py-2">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">
            Breakdown
          </h3>
          <div className="flex flex-col items-center gap-2">
            <StrokeOrder
              kanji={kanji}
              strokeMp4Url={data.strokeMp4Url}
              strokeSvgUrl={data.strokeSvgUrl}
            />
            {data.strokeImages && data.strokeImages.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {data.strokeImages.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Stroke ${idx + 1}`}
                    className="h-10 w-10 border bg-white rounded shadow-sm"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
            {/* Add radical info if available */}
            {data.radical && (
              <div className="mt-2 text-base text-slate-700">
                <span className="font-semibold">Radical:</span> {data.radical}{" "}
                {data.radical_meaning && `(${data.radical_meaning})`}
              </div>
            )}
          </div>
        </div>
      )}
      {tab === "Meaning" && (
        <div className="py-2">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">
            Meaning
          </h3>
          <div className="text-xl mb-1">
            {(data.meanings || []).join(", ") || "[meaning]"}
          </div>
          {data.hint && (
            <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-300 p-2 rounded">
              <span className="font-semibold text-yellow-700">Hint:</span>
              <span
                className="ml-2"
                dangerouslySetInnerHTML={{ __html: data.hint }}
              />
            </div>
          )}
        </div>
      )}
      {tab === "Reading" && (
        <div className="py-2">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">
            Reading
          </h3>
          <div className="mb-2">
            <span className="font-semibold text-purple-700">On'yomi:</span>
            <span className="ml-2">
              {(data.readings_on || []).join("、 ") || "[none]"}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-purple-700">Kun'yomi:</span>
            <span className="ml-2">
              {(data.readings_kun || []).join("、 ") || "[none]"}
            </span>
          </div>
          {/* Add reading explanation if available in the future */}
        </div>
      )}
      {tab === "Examples" && (
        <div className="py-2">
          <h3 className="text-lg font-semibold mb-2 text-emerald-700">
            Examples
          </h3>
          <div className="max-h-32 overflow-y-auto mt-1 space-y-1">
            {(data.examples || []).length === 0 && (
              <div className="text-slate-400 italic">
                No examples available.
              </div>
            )}
            {(data.examples || []).map((ex) => (
              <div key={ex.id} className="flex items-center gap-2 text-base">
                <span>{ex.japanese}</span>
                <span className="text-slate-500 text-sm">{ex.meaning}</span>
                {ex.audio &&
                  (ex.audio.mp3 ||
                    ex.audio.ogg ||
                    ex.audio.aac ||
                    ex.audio.opus) && (
                    <button
                      className="px-2 py-1 bg-purple-100 rounded text-purple-700"
                      onClick={() => playAudio(ex.audio)}
                    >
                      ▶️
                    </button>
                  )}
              </div>
            ))}
          </div>
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
}) {
  // kanjiList: array of kanji characters (e.g., ['日', '月', ...])
  // kanjiDataList: array of { kanji, meaning, readings, ... } (same order as kanjiList)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [step, setStep] = useState(0); // 0: lesson, 1: stroke, 2: quiz, 3: mark learned
  const [results, setResults] = useState([]); // {kanji, correct}
  const [showConfetti, setShowConfetti] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewKanji, setReviewKanji] = useState([]);

  const total = kanjiList.length;
  const currentKanji = kanjiList[currentIdx];
  const currentData = kanjiDataList[currentIdx] || {};

  const goNextStep = () => setStep((s) => s + 1);
  const goNextKanji = () => {
    setStep(0);
    setCurrentIdx((i) => i + 1);
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
    "Keep up the streak!",
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
            className="mb-4 px-4 py-2 bg-purple-500 text-white rounded font-semibold"
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
          className="px-6 py-2 bg-purple-500 text-white rounded font-semibold"
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
          className="px-6 py-2 bg-purple-500 text-white rounded font-semibold"
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
    <div className="max-w-lg mx-auto p-4 bg-white/80 rounded-xl shadow">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
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
        <div className="w-full max-w-xl mx-auto bg-white/90 rounded-xl shadow-lg p-4 md:p-8 flex flex-col gap-6">
          {/* Main Kanji Display */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="text-8xl font-bold mb-2 mt-2 md:mt-0">
              {displayCurrentKanji}
            </div>
          </div>

          {/* Tab Bar */}
          <TabSection kanji={displayCurrentKanji} data={displayCurrentData} />

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-4">
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded font-semibold"
              onClick={goNextStep}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="text-center">
          <StrokeOrder
            kanji={displayCurrentKanji}
            strokeMp4Url={displayCurrentData.strokeMp4Url}
            strokeSvgUrl={displayCurrentData.strokeSvgUrl}
          />
          <button
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
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
              setResults((r) => [
                ...r,
                { kanji: displayCurrentKanji, correct },
              ]);
              setStep(3);
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
        <div className="text-center">
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded font-semibold mr-4"
            onClick={() => {
              onMarkLearned(displayCurrentKanji);
              goNextKanji();
            }}
          >
            Mark as Learned & Next
          </button>
          <button
            className="px-4 py-2 bg-slate-300 text-slate-700 rounded font-semibold"
            onClick={goNextKanji}
          >
            Skip
          </button>
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
};

export default DailyStudySession;
