import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { styles } from "../../utils/styles";

function StudyProgress({
  currentIndex,
  total,
  correctCount,
  completed,
  accuracy,
  currentStep,
  totalSteps = 4,
}) {
  const stepProgress = ((currentStep + 1) / totalSteps) * 100;
  const overallProgress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="mb-6">
      {/* Overall Progress */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-purple-700">
          Progress: {currentIndex + 1} of {total}
        </span>
        <span className="text-sm font-medium text-purple-600">
          {Math.round(overallProgress)}% Complete
        </span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2">
        {/* Overall Progress Bar */}
        <div className="w-full bg-purple-200 rounded-full h-2">
          <motion.div
            className="bg-purple-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <motion.div
            className="bg-blue-400 h-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${stepProgress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex justify-between text-center mt-4">
        <div className="flex-1">
          <div className="text-xl font-bold text-purple-700">
            {Math.round(overallProgress)}%
          </div>
          <div className="text-purple-600 font-medium text-sm">Complete</div>
        </div>
        <div className="flex-1">
          <div className="text-xl font-bold text-purple-700">{accuracy}%</div>
          <div className="text-purple-600 font-medium text-sm">Accuracy</div>
        </div>
        <div className="flex-1">
          <div className="text-xl font-bold text-purple-700">
            {correctCount}/{completed}
          </div>
          <div className="text-purple-600 font-medium text-sm">Correct</div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
    </div>
  );
}

StudyProgress.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  correctCount: PropTypes.number.isRequired,
  completed: PropTypes.number.isRequired,
  accuracy: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number,
};

export default StudyProgress;
