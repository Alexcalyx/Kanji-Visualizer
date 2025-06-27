// src/components/Footer.jsx
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  // Replace placeholders with your actual info and links!
  const yourName = "Alex Mason";
//   const githubUrl = "https://github.com/Alexcalyx/Kanji-Visualizer"; 
  const kanjiApiName = "KanjiAlive API";
  const kanjiApiUrl = "https://rapidapi.com/KanjiAlive/api/learn-to-read-and-write-japanese-kanji"; 

  return (
    <footer className="relative z-10 mt-auto py-6 px-4 border-t border-border-light dark:border-border-dark">
      <div className="container mx-auto text-center text-sm text-subtle-light dark:text-subtle-dark">
        <p className="mb-2">
          &copy; {currentYear} {yourName} | alexcalyx@gmail.com 
        </p>
        <p className="mb-2">
          Data provided by{' '}
          <a
            href={kanjiApiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-neon hover:underline transition-colors"
          >
            {kanjiApiName}
          </a>.
        </p>
        <div className="flex justify-center items-center space-x-4">
          {/* Add links only if you have the URL */}
          {/* {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-neon hover:underline transition-colors">GitHub</a>
          )} */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;