import React, { Suspense } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const HomePage = React.lazy(() => import("../../pages/HomePage"));
const KanjiGrid = React.lazy(() => import("../../pages/KanjiGrid"));
const KanjiDetail = React.lazy(() => import("../../pages/KanjiDetail"));
const StudyPage = React.lazy(() => import("../../pages/StudyPage"));
import { ErrorDisplay, LoadingSpinner } from "../common";

function KanjiGridWrapper() {
  const { gradeId } = useParams();
  return <KanjiGrid grade={gradeId} />;
}

function AppRouter() {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.99 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -15, scale: 1.01 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            index
            element={
              <motion.div
                key="home"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <HomePage />
              </motion.div>
            }
          />
          <Route
            path="grade/:gradeId"
            element={
              <motion.div
                key="grade"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <KanjiGridWrapper />
              </motion.div>
            }
          />
          <Route
            path="kanji/:character"
            element={
              <motion.div
                key="kanji"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <KanjiDetail />
              </motion.div>
            }
          />
          <Route
            path="study"
            element={
              <motion.div
                key="study"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <StudyPage />
              </motion.div>
            }
          />
          <Route
            path="*"
            element={
              <motion.div
                key="notfound"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <div className="flex justify-center items-center pt-10">
                  <ErrorDisplay
                    message="Page Not Found (404)"
                    context="Navigation Error"
                  />
                </div>
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AppRouter;
