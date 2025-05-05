import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home({ darkMode, setDarkMode }) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const DarkModeIcon = getIcon(darkMode ? 'Sun' : 'Moon');
  const InfoIcon = getIcon('Info');
  const TrophyIcon = getIcon('Trophy');

  useEffect(() => {
    // Listen for high score changes from the game component
    const handleStorageChange = () => {
      const newHighScore = localStorage.getItem('highScore');
      if (newHighScore) {
        setHighScore(parseInt(newHighScore, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="min-h-full bg-surface-50 dark:bg-black text-surface-900 dark:text-white">
      <header className="w-full bg-opacity-50 backdrop-blur-sm fixed top-0 z-10">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-heading text-primary neon-text">
            MazeMuncher
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-primary" />
              <span className="text-sm md:text-base font-heading">{highScore}</span>
            </div>
            
            <button 
              onClick={toggleInstructions}
              className="p-2 rounded-full hover:bg-surface-700/30 transition-colors"
              aria-label="Game Instructions"
            >
              <InfoIcon className="w-5 h-5 text-primary" />
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-700/30 transition-colors"
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <DarkModeIcon className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-16 p-4 h-full">
        <MainFeature setHighScore={setHighScore} />
      </main>

      {showInstructions && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={toggleInstructions}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface-800 rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-heading text-primary mb-4">How to Play</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2">
                <span className="text-primary">•</span> 
                <span>Use <strong>arrow keys</strong> to navigate the maze</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span> 
                <span>Collect all dots to complete a level</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span> 
                <span>Power pellets let you eat ghosts temporarily</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span> 
                <span>Avoid ghosts or lose a life</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span> 
                <span>Press <strong>P</strong> to pause the game</span>
              </li>
            </ul>
            <div className="flex justify-center">
              <button 
                className="arcade-btn text-sm"
                onClick={toggleInstructions}
              >
                Let's Play!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default Home;