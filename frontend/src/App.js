import React, { useState, useEffect } from 'react';
import './App.css';
import { Header, WordleGame, WordSearchGame, AnagramGame, Statistics } from './components';

function App() {
  const [currentGame, setCurrentGame] = useState('wordle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  // Load saved data from localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem('wordPuzzleScore');
    const savedStreak = localStorage.getItem('wordPuzzleStreak');
    const savedGamesPlayed = localStorage.getItem('wordPuzzleGamesPlayed');
    
    if (savedScore) setScore(parseInt(savedScore));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedGamesPlayed) setGamesPlayed(parseInt(savedGamesPlayed));
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('wordPuzzleScore', score.toString());
    localStorage.setItem('wordPuzzleStreak', streak.toString());
    localStorage.setItem('wordPuzzleGamesPlayed', gamesPlayed.toString());
  }, [score, streak, gamesPlayed]);

  const handleScoreUpdate = (points) => {
    setScore(prevScore => prevScore + points);
    setStreak(prevStreak => prevStreak + 1);
    setGamesPlayed(prevGames => prevGames + 1);
  };

  const resetStats = () => {
    setScore(0);
    setStreak(0);
    setGamesPlayed(0);
    localStorage.removeItem('wordPuzzleScore');
    localStorage.removeItem('wordPuzzleStreak');
    localStorage.removeItem('wordPuzzleGamesPlayed');
  };

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'wordle':
        return <WordleGame onScoreUpdate={handleScoreUpdate} />;
      case 'wordsearch':
        return <WordSearchGame onScoreUpdate={handleScoreUpdate} />;
      case 'anagram':
        return <AnagramGame onScoreUpdate={handleScoreUpdate} />;
      default:
        return <WordleGame onScoreUpdate={handleScoreUpdate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header 
        currentGame={currentGame}
        setCurrentGame={setCurrentGame}
        score={score}
        streak={streak}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderCurrentGame()}
          
          <Statistics 
            score={score}
            streak={streak}
            gamesPlayed={gamesPlayed}
          />
          
          <div className="text-center mt-8">
            <button
              onClick={resetStats}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Reset All Statistics
            </button>
          </div>
          
          {/* Game Rules */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">How to Play</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-600 dark:text-purple-400">Word Guess (Wordle-style)</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Guess the 5-letter word in 6 tries. Green = correct letter and position, 
                  Yellow = correct letter but wrong position, Gray = letter not in word.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-600 dark:text-purple-400">Word Search</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Find hidden words in the letter grid. Click and drag to select letters, 
                  then click "Check Word" to see if you found a valid word.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-600 dark:text-purple-400">Anagram Challenge</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Unscramble the letters to form a valid word. Use the hint to help you 
                  figure out the correct word.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>💡 Tip:</strong> Your progress is automatically saved! Come back anytime to continue improving your scores and maintaining your streak.
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              🧩 Word Puzzle Games - Challenge your mind with words! 
            </p>
            <p className="text-xs mt-2">
              Built with React • Tailwind CSS • Modern Web Technologies
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;