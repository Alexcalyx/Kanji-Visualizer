import React, { useState, useEffect, createContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

export const ProgressContext = createContext(); // Named export

const PROGRESS_STORAGE_KEY = 'kanjiLearnedStatus';

export function ProgressProvider({ children }) { // Named export
    const [learnedKanji, setLearnedKanji] = useState(() => {
        try {
            const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch (e) {
            console.error("Failed to load learned Kanji from localStorage:", e);
            return new Set();
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(Array.from(learnedKanji)));
        } catch (e) {
            console.error("Failed to save learned Kanji to localStorage:", e);
        }
    }, [learnedKanji]);

    const toggleLearnedStatus = useCallback((kanjiCharacter) => {
        setLearnedKanji(prevLearned => {
            const newLearned = new Set(prevLearned);
            if (newLearned.has(kanjiCharacter)) {
                newLearned.delete(kanjiCharacter);
            } else {
                newLearned.add(kanjiCharacter);
            }
            return newLearned;
        });
    }, []);

    const isLearned = useCallback((kanjiCharacter) => learnedKanji.has(kanjiCharacter), [learnedKanji]);

    const value = useMemo(() => ({
        learnedKanji,
        toggleLearnedStatus,
        isLearned
    }), [learnedKanji, toggleLearnedStatus, isLearned]);

    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

ProgressProvider.propTypes = { children: PropTypes.node.isRequired };