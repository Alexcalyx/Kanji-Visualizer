import React, { useState, useEffect, createContext, useContext, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
  Outlet,
  useNavigate
} from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
// Import Framer Motion
import { motion, AnimatePresence } from 'framer-motion';
// Import react-intersection-observer hook
import { useInView } from 'react-intersection-observer';
// Import Lucide icons
import {
    BookOpen, Atom, Languages, MessageSquare, Share2, Film, Search, CheckCircle, XCircle, Info, Sun, Moon, Link as LinkIcon, LayoutGrid, Home
} from 'lucide-react';

// --- Environment Variables ---
const KANJI_ALIVE_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const KANJI_ALIVE_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

// --- Contexts ---
const ThemeContext = createContext();
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const toggleTheme = useCallback(() => setTheme(t => (t === 'light' ? 'dark' : 'light')), []);
  useEffect(() => {
    document.documentElement.className = theme;
    document.body.className = `font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-bg-light text-text-light bg-noise' : 'bg-bg-dark text-text-dark bg-noise'}`; // Apply noise bg
  }, [theme]);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
ThemeProvider.propTypes = { children: PropTypes.node.isRequired };

const ProgressContext = createContext();
const PROGRESS_STORAGE_KEY = 'kanjiLearnedStatus';
function ProgressProvider({ children }) {
    const [learnedKanji, setLearnedKanji] = useState(() => { try { const s = localStorage.getItem(PROGRESS_STORAGE_KEY); return s ? new Set(JSON.parse(s)) : new Set(); } catch (e) { return new Set(); }});
    useEffect(() => { try { localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(Array.from(learnedKanji))); } catch (e) { console.error("LS Error", e); }}, [learnedKanji]);
    const toggleLearnedStatus = useCallback((k) => setLearnedKanji(p => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n; }), []);
    const value = useMemo(() => ({ learnedKanji, toggleLearnedStatus, isLearned: (k) => learnedKanji.has(k) }), [learnedKanji, toggleLearnedStatus]);
    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
ProgressProvider.propTypes = { children: PropTypes.node.isRequired };


// --- Custom Hooks ---

// Hook for triggering animations when element is in view
function useAnimateInView() {
    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger once
        threshold: 0.1, // Trigger when 10% visible
    });
    const animation = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };
    return [ref, animation, inView];
}


// useKanjiList - unchanged functionality, added delay
function useKanjiList(gradeId) {
  const [kanjiList, setKanjiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const gradeNumber = parseInt(gradeId, 10);
    if (!gradeId || isNaN(gradeNumber) || gradeNumber < 1 || gradeNumber > 6) { setKanjiList([]); setError(isNaN(gradeNumber) ? 'Invalid grade.' : null); setIsLoading(false); return; }
    const gradeParam = `grade=${gradeNumber}`;
    if (!KANJI_ALIVE_API_KEY || !KANJI_ALIVE_API_HOST) { setError("API Key/Host missing."); setKanjiList([]); setIsLoading(false); return; }
    const controller = new AbortController(); const signal = controller.signal;
    const fetchGradeData = async () => {
        setIsLoading(true); setError(null); setKanjiList([]);
        const url = `https://${KANJI_ALIVE_API_HOST}/api/public/search/advanced?${gradeParam}`;
        const options = { method: 'GET', headers: { 'X-RapidAPI-Key': KANJI_ALIVE_API_KEY, 'X-RapidAPI-Host': KANJI_ALIVE_API_HOST }, signal };
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
            const response = await fetch(url, options);
            if (!response.ok) { let e = `HTTP error ${response.status}`; try { const d = await response.json(); e += ` - ${d.message||'?'}`; } catch(err){} throw new Error(e); }
            const data = await response.json();
            if (Array.isArray(data)) { const list = data.map(item => item?.kanji?.character).filter(Boolean); setKanjiList(list); }
            else { throw new Error(`Unexpected API format G${gradeId}.`); }
        } catch (err) { if (err.name !== 'AbortError') { setError(err.message || `Failed fetch G${gradeId}.`); setKanjiList([]); }
        } finally { if (!signal.aborted) setIsLoading(false); }
    };
    fetchGradeData();
    return () => controller.abort();
  }, [gradeId]);
  return { kanjiList, isLoading, error };
}

// useKanjiDetails - unchanged functionality, added delay
function useKanjiDetails(character) {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!character) { setDetails(null); setError(null); setIsLoading(false); return; }
        if (!KANJI_ALIVE_API_KEY || !KANJI_ALIVE_API_HOST) { setError("API Key/Host missing."); setDetails(null); setIsLoading(false); return; }
        const decodedChar = decodeURIComponent(character);
        const controller = new AbortController(); const signal = controller.signal;
        const fetchData = async () => {
            setIsLoading(true); setError(null); setDetails(null);
            const url = `https://${KANJI_ALIVE_API_HOST}/api/public/kanji/${decodedChar}`;
            const options = { method: 'GET', headers: { 'X-RapidAPI-Key': KANJI_ALIVE_API_KEY, 'X-RapidAPI-Host': KANJI_ALIVE_API_HOST }, signal };
            try {
                await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
                const response = await fetch(url, options);
                if (!response.ok) { let e = `HTTP error ${response.status}`; try { const d = await response.json(); e += ` - ${d.message||'?'}`; } catch(err){} throw new Error(e); }
                const data = await response.json();
                if (!data || !data.kanji) { throw new Error(`Details not found for Kanji '${decodedChar}' via API.`); }
                const transformedDetails = {
                    character: data.kanji?.character, meanings: data.kanji?.meaning?.english?.split(', ') || [],
                    readings_on: data.kanji?.onyomi?.katakana?.split('、') || [], readings_kun: data.kanji?.kunyomi?.hiragana?.split('、') || [],
                    strokes: data.kanji?.strokes?.count, grade: data.kanji?.references?.grade, jlpt: data.kanji?.references?.jlpt,
                    radical: data.radical?.character, radical_strokes: data.radical?.strokes,
                    examples: data.examples?.map((ex, index) => ({ id: `${decodedChar}-ex-${index}`, japanese: ex.japanese || '?', meaning: ex.meaning?.english || '?' })) || [],
                    strokeSvgUrl: data.kanji?.video?.poster, strokeMp4Url: data.kanji?.video?.mp4, related: [],
                };
                setDetails(transformedDetails);
            } catch (err) { if (err.name !== 'AbortError') { setError(err.message || 'Failed fetch details.'); setDetails(null); }
            } finally { if (!signal.aborted) setIsLoading(false); }
        };
        fetchData();
        return () => controller.abort();
    }, [character]);
    return { details, isLoading, error };
}


// --- UI Components ---

/**
 * Simple animated spinner component - Vibrant Style.
 */
function Spinner({ size = 'md' }) {
    const sizeClasses = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' };
    // Use primary accent color for spinner
    return ( <div className={`inline-block animate-spin rounded-full border-solid border-primary dark:border-primary-light border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]}`} role="status"><span className="sr-only">Loading...</span></div> );
}
Spinner.propTypes = { size: PropTypes.oneOf(['sm', 'md', 'lg']) };

/**
 * Displays a styled error message box - Vibrant Style.
 */
function ErrorDisplay({ message, context }) {
    const { theme } = useContext(ThemeContext);
    if (!message) return null;
    // Use secondary accent color for error emphasis
    return ( <div className={`text-center p-6 md:p-8 rounded-lg border-l-4 shadow-lg ${theme === 'light' ? 'bg-secondary/10 border-secondary text-secondary-dark' : 'bg-secondary/10 border-secondary-light text-secondary-light'}`}><p className="font-semibold text-lg flex items-center justify-center gap-2"><XCircle size={20} /> Error {context || 'Loading Data'}:</p><p className="text-sm mt-2">{message}</p></div> );
}
ErrorDisplay.propTypes = { message: PropTypes.string, context: PropTypes.string };

/**
 * Main application layout - Maximalist Style.
 */
function Layout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  // Glassmorphism navbar style
  const navStyle = `p-4 shadow-lg sticky top-0 z-50 border-b glassmorphism ${theme === 'light' ? 'glassmorphism-light border-white/20' : 'glassmorphism-dark border-slate-700/30'}`;
  const primaryColor = 'text-primary dark:text-primary-light'; // Use defined colors
  const navLinkStyle = `text-sm sm:text-base font-medium transition-colors px-2 py-1 rounded-md ${theme === 'light' ? 'text-slate-600 hover:text-primary hover:bg-primary/10' : 'text-slate-300 hover:text-primary-light hover:bg-primary-light/10'}`;
  const themeButtonBg = theme === 'light' ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-700 hover:bg-slate-600';
  const themeButtonIcon = theme === 'light' ? 'text-slate-700' : 'text-yellow-300';

  return (
    // Apply background with noise pattern
    <div className={`min-h-screen font-sans bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark bg-noise`}>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={navStyle}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className={`text-3xl font-display font-bold hover:${primaryColor} transition-colors`}> {/* Use display font */}
            漢字<span className={primaryColor}>Viz</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
             {[1, 2, 3, 4, 5, 6].map(grade => (<Link key={grade} to={`/grade/${grade}`} className={navLinkStyle}>G{grade}</Link>))}
            <motion.button
              onClick={toggleTheme} title="Toggle Theme" aria-label="Toggle theme"
              className={`p-2 rounded-full transition-colors duration-200 ${themeButtonBg}`}
              whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}
            >
              <div className="w-5 h-5 overflow-hidden">
                  <motion.div animate={{ y: theme === 'dark' ? '-100%' : '0%' }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
                      <Sun size={20} className={themeButtonIcon} />
                      <Moon size={20} className={themeButtonIcon} />
                  </motion.div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>
      {/* AnimatePresence for route transitions */}
      <main className="container mx-auto p-4 py-6 md:p-8 md:py-10">
         {/* Note: Route transition requires AnimatedRoutes setup, simplified here */}
         <Outlet />
      </main>
      <footer className={`text-center p-6 mt-12 text-xs border-t ${theme === 'light' ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800'}`}>
        © {new Date().getFullYear()} Kanji Visualizer Project - Maximalist Edition
      </footer>
    </div>
  );
}

/**
 * Component displaying links to select a school grade level - Vibrant Style.
 */
function LevelSelector() {
    const { theme } = useContext(ThemeContext);
    // Button styles with vibrant colors and effects
    const buttonBase = "px-6 py-3 rounded-lg font-display text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-transparent"; // Use display font
    const buttonActive = theme === 'light'
        ? "bg-gradient-to-br from-primary to-secondary text-white hover:from-primary-dark hover:to-secondary-dark"
        : "bg-gradient-to-br from-primary-light to-secondary-light text-slate-900 hover:from-cyan-400 hover:to-pink-400";
    const buttonDisabled = theme === 'light' ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-700 text-slate-500 cursor-not-allowed";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className={`p-6 md:p-10 rounded-xl shadow-2xl glassmorphism ${theme === 'light' ? 'glassmorphism-light border-white/30' : 'glassmorphism-dark border-slate-700/40'}`} // More prominent glassmorphism
        >
            <h2 className="text-3xl font-display font-bold mb-8 text-center sm:text-left text-transparent bg-clip-text bg-gradient-to-r from-primary dark:from-primary-light to-secondary dark:to-secondary-light"> {/* Gradient text */}
                Select School Grade Level
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-5">
                {[1, 2, 3, 4, 5, 6].map(grade => (
                    <motion.div key={grade} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to={`/grade/${grade}`} className={`${buttonBase} ${buttonActive}`}>
                            Grade {grade}
                        </Link>
                    </motion.div>
                ))}
                <div className={`${buttonBase} ${buttonDisabled}`}>
                    Jouyou (Soon)
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Displays a grid of Kanji for a selected grade - Animated Grid.
 */
function KanjiGrid() {
  const { gradeId } = useParams();
  const { kanjiList, isLoading, error } = useKanjiList(gradeId);
  const { theme } = useContext(ThemeContext);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debounceTimeoutRef = useRef(null);

  useEffect(() => { /* ... debounce logic ... */ if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); debounceTimeoutRef.current = setTimeout(() => setSearchTerm(inputValue), 300); return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); }; }, [inputValue]);
  const filteredKanjiList = useMemo(() => { /* ... filter logic ... */ if (!searchTerm) return kanjiList; const l = searchTerm.toLowerCase(); if (!Array.isArray(kanjiList)) return []; return kanjiList.filter(k => k && k.toLowerCase().includes(l)); }, [kanjiList, searchTerm]);

  if (isLoading) return ( <div className="flex flex-col items-center justify-center min-h-[40vh] text-subtle-light dark:text-subtle-dark"><Spinner size="lg" /><p className="mt-4 text-lg">Loading Grade {gradeId} Kanji...</p></div> );
  if (error) return <div className="mt-10"><ErrorDisplay message={error} context={`Grade ${gradeId} Kanji List`} /></div>;

  // Animation variants for the grid container and items
  const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.1 } }
  };
  const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="space-y-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-display font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary dark:from-primary-light to-secondary dark:to-secondary-light"
      >
          Grade {gradeId} Kanji
      </motion.h2>
      {/* Search Input */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative max-w-lg mx-auto">
         <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500"><Search size={20} /></span>
        <input type="text" placeholder="Search character..." value={inputValue} onChange={(e) => setInputValue(e.target.value)}
          className={`w-full pl-12 pr-4 py-2.5 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light ${ theme === 'light' ? 'bg-white/80 border-slate-300 text-text-light' : 'bg-slate-700/80 border-slate-600 text-text-dark placeholder-slate-400' } backdrop-blur-sm`} // Added slight transparency/blur
        />
      </motion.div>
      {/* Animated Grid */}
      {filteredKanjiList && filteredKanjiList.length > 0 ? (
        <motion.div
            className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 md:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {filteredKanjiList.map((kanji) => (
            <motion.div key={kanji} variants={itemVariants}> {/* Wrap item in motion.div */}
                <KanjiGridItem kanji={kanji} theme={theme} />
            </motion.div>
           ))}
        </motion.div>
      ) : ( <div className="text-center text-subtle-light dark:text-subtle-dark mt-16 py-8 border-t border-dashed border-border-light dark:border-border-dark">{kanjiList && kanjiList.length > 0 ? 'No Kanji found matching your search.' : `No Kanji data loaded for Grade ${gradeId}.`}</div> )}
    </div>
  );
}

/**
 * Represents a single Kanji character in the grid - Animated Item.
 */
function KanjiGridItem({ kanji, theme }) {
  const { isLearned } = useContext(ProgressContext);
  const learned = isLearned(kanji);
  const learnedBg = theme === 'light' ? 'bg-emerald-100/70 border-emerald-500' : 'bg-emerald-800/50 border-emerald-500';
  const baseBg = theme === 'light' ? 'bg-white/60 hover:bg-sky-50/80 border-slate-200/80' : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-700/80';
  const learnedIndicatorStyle = theme === 'light' ? 'bg-secondary-light text-white' : 'bg-secondary-dark text-emerald-950';

  return (
    // Use motion.div for hover animations from Framer Motion
    <motion.div whileHover={{ scale: 1.1, zIndex: 10, transition: { type: 'spring', stiffness: 300 } }} className="relative">
        <Link to={`/kanji/${encodeURIComponent(kanji)}`}
          className={`flex items-center justify-center group aspect-square text-4xl md:text-5xl font-medium rounded-xl border transition-colors duration-200 ease-in-out shadow-lg backdrop-blur-sm ${learned ? learnedBg : baseBg}`} // Added backdrop-blur
          title={learned ? 'Learned' : `View details for ${kanji}`}
        >
          <span className="group-hover:scale-110 transition-transform duration-150">{kanji}</span> {/* Scale Kanji on hover */}
          {learned && (
            <motion.span initial={{scale:0}} animate={{scale:1}} transition={{delay: 0.1, type:'spring', stiffness: 400}}
             className={`absolute -top-1.5 -right-1.5 text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md ${learnedIndicatorStyle}`}>
              ✓
            </motion.span>
           )}
        </Link>
    </motion.div>
  );
}
KanjiGridItem.propTypes = { kanji: PropTypes.string.isRequired, theme: PropTypes.string.isRequired };

// --- Detail View Components ---

/**
 * Main component for displaying detailed Kanji information - Animated Layout.
 */
function KanjiDetail() {
    const { character } = useParams();
    const { details, isLoading: detailsLoading, error: detailsError } = useKanjiDetails(character);
    const { theme } = useContext(ThemeContext);
    const { isLearned, toggleLearnedStatus } = useContext(ProgressContext);
    const displayCharacter = details?.character;
    const learned = displayCharacter ? isLearned(displayCharacter) : false;

    if (detailsLoading) return ( <div className="flex flex-col items-center justify-center min-h-[50vh] text-subtle-light dark:text-subtle-dark"><Spinner size="lg" /><p className="mt-4 text-lg">Loading Kanji Details...</p></div> );
    if (detailsError) return <div className="mt-10"><ErrorDisplay message={detailsError} context="Kanji Details" /></div>;
    if (!details || !details.character) return ( <div className="text-center text-xl p-10 text-subtle-light dark:text-subtle-dark">No details available for this Kanji.</div> );

    const handleToggleLearned = () => { if (displayCharacter) toggleLearnedStatus(displayCharacter); };

    const toggleButtonBase = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 border-2 border-transparent";
    const learnedButton = theme === 'light' ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:border-yellow-600' : 'bg-yellow-600 hover:bg-yellow-500 text-yellow-50 hover:border-yellow-400';
    const notLearnedButton = theme === 'light' ? 'bg-emerald-400 hover:bg-emerald-500 text-emerald-900 hover:border-emerald-600' : 'bg-emerald-600 hover:bg-emerald-500 text-emerald-50 hover:border-emerald-400';

    // Animation variants for the detail page sections
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div className="space-y-10" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {/* Header Section - Animated */}
            <motion.div variants={sectionVariants}
              className={`p-6 md:p-8 rounded-xl shadow-2xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 glassmorphism ${theme === 'light' ? 'glassmorphism-light border-white/30' : 'glassmorphism-dark border-slate-700/40'}`} // Glassmorphism Header
            >
                <div className="flex items-center gap-4 sm:gap-6">
                     {/* TODO: Replace with 3D Kanji model */}
                     <motion.h1 initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="text-8xl sm:text-9xl md:text-[10rem] font-display font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary dark:from-primary-light to-secondary dark:to-secondary-light" // Gradient Kanji
                    >
                        {displayCharacter}
                    </motion.h1>
                     <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-start gap-3 pt-2">
                        <p className={`text-2xl md:text-3xl font-semibold ${theme === 'light' ? 'text-primary-dark' : 'text-primary-light'}`}>{details.meanings?.join(', ') || 'N/A'}</p>
                        <KanjiInfo details={details} theme={theme} />
                         {learned && ( <motion.span initial={{scale:0}} animate={{scale:1}} transition={{delay: 0.6, type:'spring'}} className={`mt-1 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${theme === 'light' ? 'bg-secondary-light text-white' : 'bg-secondary-dark text-emerald-950'}`}><CheckCircle size={14}/> Learned</motion.span> )}
                     </motion.div>
                </div>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 sm:mt-0 flex-shrink-0">
                     <motion.button onClick={handleToggleLearned} className={`${toggleButtonBase} ${learned ? learnedButton : notLearnedButton}`}
                        whileHover={{ scale: 1.05, transition: { yoyo: Infinity, duration: 0.3 } }} whileTap={{ scale: 0.95 }}
                     >
                         {learned ? <><XCircle size={16}/> Mark Unlearned</> : <><CheckCircle size={16}/> Mark Learned</>}
                     </motion.button>
                 </motion.div>
            </motion.div>

            {/* Main Content Grid - Animated Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Left Column */}
                <div className="space-y-6 md:space-y-8">
                    <AnimatedInfoCard title="Readings" icon={Languages} theme={theme}>
                        <ReadingsContent readingsOn={details.readings_on} readingsKun={details.readings_kun} />
                    </AnimatedInfoCard>
                    <AnimatedInfoCard title="Structure" icon={Atom} theme={theme}>
                        <KanjiStructureContent radical={details.radical} radical_strokes={details.radical_strokes} />
                    </AnimatedInfoCard>
                    <AnimatedInfoCard title="Examples" icon={MessageSquare} theme={theme}>
                         <ExampleWordListContent examples={details.examples} theme={theme} />
                    </AnimatedInfoCard>
                </div>

                {/* Right Column */}
                <div className="space-y-6 md:space-y-8">
                    <AnimatedInfoCard title="Stroke Order" icon={Film} theme={theme}>
                        <StrokeOrderDisplayContent character={displayCharacter} strokeSvgUrl={details.strokeSvgUrl} strokeMp4Url={details.strokeMp4Url} theme={theme} />
                    </AnimatedInfoCard>
                    <AnimatedInfoCard title="Relationships" icon={Share2} theme={theme}>
                         <KanjiGraphContent character={displayCharacter} details={details} theme={theme} />
                    </AnimatedInfoCard>
                    <AnimatedInfoCard title="Related Kanji" icon={LinkIcon} theme={theme}>
                         <RelatedKanjiContent related={details.related} theme={theme} />
                    </AnimatedInfoCard>
                </div>
            </div>
        </motion.div>
    );
}


/**
 * Animated version of InfoCard using Framer Motion and Intersection Observer.
 */
function AnimatedInfoCard({ title, icon: Icon, theme, children }) {
    const [ref, animation, inView] = useAnimateInView(); // Use custom hook

    return (
         <motion.div
            ref={ref} // Attach ref for intersection observer
            variants={animation} // Use animation variants from hook
            initial="hidden"
            animate={inView ? "visible" : "hidden"} // Animate based on inView state
            className={`rounded-xl shadow-xl overflow-hidden glassmorphism ${theme === 'light' ? 'glassmorphism-light border-white/30' : 'glassmorphism-dark border-slate-700/40'}`} // Glassmorphism Card
         >
            <h3 className={`flex items-center gap-2 text-lg sm:text-xl font-semibold p-4 border-b ${theme === 'light' ? 'bg-white/30 border-border-light text-slate-700' : 'bg-slate-900/30 border-border-dark text-slate-200'}`}>
                {Icon && <Icon size={20} className="text-primary dark:text-primary-light" />}
                {title}
            </h3>
            <div className="p-4 md:p-5">
                {children}
            </div>
        </motion.div>
    );
}
AnimatedInfoCard.propTypes = { title: PropTypes.string.isRequired, icon: PropTypes.elementType, theme: PropTypes.string.isRequired, children: PropTypes.node };

// --- Other Detail Content Components (KanjiInfo, ReadingsContent, etc.) ---
// (These remain mostly the same structurally, but will inherit new card styling)

function KanjiInfo({ details, theme }) { /* ... same as before ... */ return ( <div className={`p-3 rounded-lg shadow-sm w-full max-w-xs ${theme === 'light' ? 'bg-slate-50/70 border border-slate-200/50' : 'bg-slate-700/70 border border-slate-600/50'}`}> <div className="text-xs sm:text-sm text-text-light dark:text-text-dark space-y-1 text-left"> <p><strong className="font-medium text-subtle-light dark:text-subtle-dark w-14 inline-block">Grade:</strong> {details.grade ?? 'N/A'}</p> <p><strong className="font-medium text-subtle-light dark:text-subtle-dark w-14 inline-block">JLPT:</strong> N{details.jlpt ?? 'N/A'}</p> <p><strong className="font-medium text-subtle-light dark:text-subtle-dark w-14 inline-block">Strokes:</strong> {details.strokes ?? 'N/A'}</p> </div> </div> ); }
KanjiInfo.propTypes = { details: PropTypes.object.isRequired, theme: PropTypes.string.isRequired };

function ReadingsContent({ readingsOn, readingsKun }) { /* ... same as before ... */ return ( <div className="space-y-3 text-sm sm:text-base"> <div><span className="font-medium text-secondary dark:text-secondary-light mr-3 w-16 flex-shrink-0">On'yomi:</span><span className="font-mono">{readingsOn && readingsOn.length > 0 ? readingsOn.join(', ') : 'N/A'}</span></div> <div><span className="font-medium text-primary dark:text-primary-light mr-3 w-16 flex-shrink-0">Kun'yomi:</span><span className="font-mono">{readingsKun && readingsKun.length > 0 ? readingsKun.join(', ') : 'N/A'}</span></div> </div> ); }
ReadingsContent.propTypes = { readingsOn: PropTypes.arrayOf(PropTypes.string), readingsKun: PropTypes.arrayOf(PropTypes.string) };

function ExampleWordListContent({ examples, theme }) { /* ... same as before ... */ return ( <> {examples && examples.length > 0 ? ( <ul className="space-y-4"> {examples.map((ex) => ( <li key={ex.id} className={`p-3 rounded-md transition-colors duration-150 ${theme === 'light' ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-700/60 hover:bg-slate-700'}`}> <p className={`font-semibold text-base md:text-lg mb-1 ${theme === 'light' ? 'text-primary-dark' : 'text-primary-light'}`}>{ex.japanese || '?'}</p> <p className={`text-sm italic ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>{ex.meaning || '?'}</p> </li> ))} </ul> ) : ( <p className="text-sm text-center py-4 text-subtle-light dark:text-subtle-dark">No examples available.</p> )} </> ); }
ExampleWordListContent.propTypes = { examples: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, japanese: PropTypes.string, meaning: PropTypes.string })), theme: PropTypes.string.isRequired };

function KanjiStructureContent({ radical, radical_strokes }) { /* ... same as before ... */ const { theme } = useContext(ThemeContext); return ( <div className="space-y-4"> {radical ? ( <div> <h4 className="font-medium text-sm text-subtle-light dark:text-subtle-dark mb-1">Radical</h4> <div className="flex items-center gap-3"> <span className={`text-5xl font-medium inline-block p-2 rounded-md ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>{radical}</span> {radical_strokes && <span className="text-sm text-subtle-light dark:text-subtle-dark">({radical_strokes} strokes)</span>} </div> </div> ) : <p className="text-sm text-subtle-light dark:text-subtle-dark">Radical info not available.</p>} <div> <h4 className="font-medium text-sm text-subtle-light dark:text-subtle-dark mb-1">Components</h4> <p className="text-sm text-subtle-light dark:text-subtle-dark italic">(Component data source needed)</p> </div> </div> ); }
KanjiStructureContent.propTypes = { radical: PropTypes.string, radical_strokes: PropTypes.number };

function RelatedKanjiContent({ related, theme }) { /* ... same as before ... */ return ( <div className="flex flex-wrap gap-x-3 gap-y-1 min-h-[3rem]"> {/* Added min height */} <p className="text-sm text-subtle-light dark:text-subtle-dark italic">(Relationship data source needed)</p> </div> ); }
RelatedKanjiContent.propTypes = { related: PropTypes.arrayOf(PropTypes.string), theme: PropTypes.string.isRequired };

function StrokeOrderDisplayContent({ character, strokeSvgUrl, strokeMp4Url, theme }) { /* ... same as before ... */ const isLoading = !character; const hasVideo = !!strokeMp4Url; const hasSvg = !!strokeSvgUrl; const displayContent = () => { if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner size="md" /></div>; if (hasVideo) return ( <video key={strokeMp4Url} controls poster={strokeSvgUrl || ''} className="w-full max-w-[200px] h-auto object-contain bg-white dark:bg-slate-800 rounded border border-border-light dark:border-border-dark shadow-inner" preload="metadata" aria-label={`Stroke order video for ${character}`}><source src={strokeMp4Url} type="video/mp4" />Video not supported.</video> ); if (hasSvg) return ( <img src={strokeSvgUrl} alt={`Stroke order diagram for ${character}`} className="w-full max-w-[200px] h-auto object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display='none'; }} /> ); return <p className="text-sm text-center text-subtle-light dark:text-subtle-dark">Stroke media not available.</p>; }; return ( <div className="flex flex-col items-center justify-center w-full min-h-[200px]"> {displayContent()} </div> ); }
StrokeOrderDisplayContent.propTypes = { character: PropTypes.string, strokeSvgUrl: PropTypes.string, strokeMp4Url: PropTypes.string, theme: PropTypes.string.isRequired };

function KanjiGraphContent({ character, details, theme }) { /* ... same as before ... */ const navigate = useNavigate(); const fgRef = useRef(); const graphData = useMemo(() => { const n = []; if (character) { n.push({ id: character, name: character, val: 8 }); } return { nodes: n, links: [] }; }, [character]); const handleNodeClick = useCallback((node) => { if (node.id && node.id !== character) { navigate(`/kanji/${encodeURIComponent(node.id)}`); } }, [navigate, character]); const renderNode = useCallback((node, ctx, globalScale) => { const l = node.name || ''; const fs = 16 / globalScale; ctx.font = `${fs}px Sans-Serif`; const br = (node.val || 1); const nr = Math.max(br * 1.5 / globalScale, 3 / globalScale); ctx.beginPath(); ctx.arc(node.x, node.y, nr + 2 / globalScale, 0, 2 * Math.PI, false); ctx.fillStyle = theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)'; ctx.fill(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = theme === 'light' ? 'text-text-light' : 'text-text-dark'; ctx.fillText(l, node.x, node.y); node.__bckgDimensions = [nr * 2 + 4 / globalScale, nr * 2 + 4 / globalScale]; }, [theme, character]); return ( <div className="w-full h-64 md:h-80 relative"> {!details && ( <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm z-10"><Spinner size="md" /></div> )} {details && graphData.nodes.length > 0 ? ( <div className={`absolute inset-0 border rounded-lg ${theme === 'light' ? 'border-border-light' : 'border-border-dark'}`}><ForceGraph2D ref={fgRef} graphData={graphData} nodeLabel="name" nodeVal="val" nodeRelSize={4} nodeCanvasObject={renderNode} nodeCanvasObjectMode={() => 'after'} linkWidth={0} onNodeClick={handleNodeClick} cooldownTicks={1} onEngineStop={() => fgRef.current?.zoomToFit(400, 150)} enableZoomInteraction={true} enablePanInteraction={true} /></div> ) : ( <div className="flex items-center justify-center h-full text-subtle-light dark:text-subtle-dark">{details ? 'No relationship data.' : ''}</div> )} {details && ( <div className="absolute bottom-1 left-2 text-xs text-subtle-light dark:text-subtle-dark">(Relationship data needed)</div> )} </div> ); }
KanjiGraphContent.propTypes = { character: PropTypes.string, details: PropTypes.object, theme: PropTypes.string.isRequired };


// --- Main App Component ---
function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LevelSelector />} />
                <Route path="grade/:gradeId" element={<KanjiGrid />} />
                <Route path="kanji/:character" element={<KanjiDetail />} />
                <Route path="*" element={<div className="mt-10"><ErrorDisplay message="Page Not Found (404)" context="Navigation Error" /></div>} />
              </Route>
            </Routes>
          </Router>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;