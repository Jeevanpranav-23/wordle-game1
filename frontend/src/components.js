import React, { useState, useEffect } from 'react';

// Header Component
export const Header = ({ currentGame, setCurrentGame, score, streak }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              🧩 Word Puzzle
            </h1>
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentGame('wordle')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentGame === 'wordle'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                }`}
              >
                Word Guess
              </button>
              <button
                onClick={() => setCurrentGame('wordsearch')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentGame === 'wordsearch'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                }`}
              >
                Word Search
              </button>
              <button
                onClick={() => setCurrentGame('anagram')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentGame === 'anagram'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                }`}
              >
                Anagram
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
              <div className="font-bold text-lg text-purple-600 dark:text-purple-400">{score}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Streak</div>
              <div className="font-bold text-lg text-orange-600 dark:text-orange-400">{streak}</div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden mt-4 flex space-x-2">
          <button
            onClick={() => setCurrentGame('wordle')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentGame === 'wordle'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800'
            }`}
          >
            Guess
          </button>
          <button
            onClick={() => setCurrentGame('wordsearch')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentGame === 'wordsearch'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setCurrentGame('anagram')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentGame === 'anagram'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800'
            }`}
          >
            Anagram
          </button>
        </div>
      </div>
    </header>
  );
};

// Wordle Game Component
export const WordleGame = ({ onScoreUpdate }) => {
  const [currentWord, setCurrentWord] = useState('REACT');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [showHint, setShowHint] = useState(false);

  const words = ['REACT', 'CODES', 'GAMES', 'PUZZLE', 'WORDS', 'BRAIN', 'SMART', 'LOGIC'];
  
  const getLetterStatus = (letter, position, word) => {
    if (word[position] === letter) return 'correct';
    if (word.includes(letter)) return 'present';
    return 'absent';
  };

  const submitGuess = () => {
    if (currentGuess.length !== 5) return;
    
    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess.toUpperCase();
    setGuesses(newGuesses);
    
    if (currentGuess.toUpperCase() === currentWord) {
      setGameStatus('won');
      onScoreUpdate(100 * (6 - currentRow));
    } else if (currentRow === 5) {
      setGameStatus('lost');
    } else {
      setCurrentRow(currentRow + 1);
    }
    
    setCurrentGuess('');
  };

  const newGame = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setGuesses(Array(6).fill(''));
    setCurrentGuess('');
    setCurrentRow(0);
    setGameStatus('playing');
    setShowHint(false);
  };

  const handleKeyPress = (key) => {
    if (gameStatus !== 'playing') return;
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key);
    }
  };

  useEffect(() => {
    const handleKeyboard = (e) => {
      handleKeyPress(e.key.toUpperCase());
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [currentGuess, gameStatus]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Word Guess</h2>
        <p className="text-gray-600 dark:text-gray-300">Guess the 5-letter word in 6 tries!</p>
        
        {gameStatus === 'won' && (
          <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-bold">🎉 Congratulations! You won!</p>
            <button onClick={newGame} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              New Game
            </button>
          </div>
        )}
        
        {gameStatus === 'lost' && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-bold">😔 Game Over! The word was: {currentWord}</p>
            <button onClick={newGame} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              New Game
            </button>
          </div>
        )}
      </div>

      {/* Game Grid */}
      <div className="grid grid-rows-6 gap-2 mb-6">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const letter = rowIndex === currentRow ? currentGuess[colIndex] || '' : guess[colIndex] || '';
              const isSubmitted = rowIndex < currentRow;
              let bgColor = 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600';
              
              if (isSubmitted && letter) {
                const status = getLetterStatus(letter, colIndex, currentWord);
                if (status === 'correct') bgColor = 'bg-green-500 border-green-500 text-white';
                else if (status === 'present') bgColor = 'bg-yellow-500 border-yellow-500 text-white';
                else bgColor = 'bg-gray-500 border-gray-500 text-white';
              }
              
              return (
                <div
                  key={colIndex}
                  className={`w-14 h-14 flex items-center justify-center text-xl font-bold rounded-lg transition-all duration-300 ${bgColor}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Virtual Keyboard */}
      <div className="space-y-2">
        {[
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
          ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
        ].map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`px-3 py-2 rounded-lg font-bold transition-all duration-200 ${
                  key === 'ENTER' || key === 'BACKSPACE'
                    ? 'bg-gray-400 dark:bg-gray-600 text-white px-4'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
        {showHint && (
          <p className="mt-2 text-blue-600 dark:text-blue-400">
            Hint: This word relates to technology and programming!
          </p>
        )}
      </div>
    </div>
  );
};

// Word Search Game Component
export const WordSearchGame = ({ onScoreUpdate }) => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState(['REACT', 'CODE', 'GAME', 'WEB', 'CSS']);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const gridSize = 10;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const generateGrid = () => {
    const newGrid = Array(gridSize).fill().map(() => 
      Array(gridSize).fill().map(() => 
        letters[Math.floor(Math.random() * letters.length)]
      )
    );

    // Place words in grid
    words.forEach(word => {
      const direction = Math.floor(Math.random() * 4); // 0: horizontal, 1: vertical, 2: diagonal
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 50) {
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(newGrid, word, startRow, startCol, direction)) {
          placeWord(newGrid, word, startRow, startCol, direction);
          placed = true;
        }
        attempts++;
      }
    });

    setGrid(newGrid);
  };

  const canPlaceWord = (grid, word, row, col, direction) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [-1, 1] // diagonal up-right
    ];

    const [dRow, dCol] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      
      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [-1, 1] // diagonal up-right
    ];

    const [dRow, dCol] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      grid[newRow][newCol] = word[i];
    }
  };

  const handleCellClick = (row, col) => {
    if (isSelecting) {
      setSelectedCells([...selectedCells, `${row}-${col}`]);
    } else {
      setSelectedCells([`${row}-${col}`]);
      setIsSelecting(true);
    }
  };

  const checkWord = () => {
    const selectedLetters = selectedCells.map(cell => {
      const [row, col] = cell.split('-').map(Number);
      return grid[row][col];
    }).join('');

    const reversedLetters = selectedLetters.split('').reverse().join('');

    const foundWord = words.find(word => 
      word === selectedLetters || word === reversedLetters
    );

    if (foundWord && !foundWords.includes(foundWord)) {
      setFoundWords([...foundWords, foundWord]);
      onScoreUpdate(foundWord.length * 10);
    }

    setSelectedCells([]);
    setIsSelecting(false);
  };

  useEffect(() => {
    generateGrid();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Word Search</h2>
        <p className="text-gray-600 dark:text-gray-300">Find the hidden words in the grid!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded transition-all duration-200 ${
                    selectedCells.includes(`${rowIndex}-${colIndex}`)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {letter}
                </button>
              ))
            )}
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={checkWord}
              disabled={selectedCells.length === 0}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Check Word
            </button>
            <button
              onClick={() => {
                setSelectedCells([]);
                setIsSelecting(false);
              }}
              className="ml-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Word List */}
        <div className="lg:w-64">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Find These Words:</h3>
          <div className="space-y-2">
            {words.map(word => (
              <div
                key={word}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  foundWords.includes(word)
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 line-through'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'
                }`}
              >
                {word}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <h4 className="font-bold text-purple-800 dark:text-purple-200">Progress</h4>
            <p className="text-purple-600 dark:text-purple-300">
              {foundWords.length} / {words.length} words found
            </p>
            {foundWords.length === words.length && (
              <p className="text-green-600 dark:text-green-400 font-bold mt-2">🎉 All words found!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Anagram Game Component
export const AnagramGame = ({ onScoreUpdate }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [hint, setHint] = useState('');

  const wordList = [
    { word: 'LISTEN', hint: 'To hear with attention' },
    { word: 'SILENT', hint: 'Without sound' },
    { word: 'REACT', hint: 'JavaScript library' },
    { word: 'CREATE', hint: 'To make something' },
    { word: 'TEACHER', hint: 'Person who educates' },
    { word: 'CHEATER', hint: 'Person who breaks rules' },
    { word: 'EARTH', hint: 'Our planet' },
    { word: 'HEART', hint: 'Organ that pumps blood' }
  ];

  const scrambleWord = (word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const newGame = () => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(randomWord.word);
    setScrambledWord(scrambleWord(randomWord.word));
    setHint(randomWord.hint);
    setUserGuess('');
    setGameStatus('playing');
  };

  const checkGuess = () => {
    if (userGuess.toUpperCase() === currentWord) {
      setGameStatus('won');
      onScoreUpdate(currentWord.length * 15);
    } else {
      setGameStatus('wrong');
      setTimeout(() => setGameStatus('playing'), 1500);
    }
  };

  useEffect(() => {
    newGame();
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Anagram Challenge</h2>
        <p className="text-gray-600 dark:text-gray-300">Unscramble the letters to form a word!</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg text-gray-600 dark:text-gray-300 mb-2">Scrambled Word:</h3>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 tracking-wider">
            {scrambledWord}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Guess:
          </label>
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-xl font-bold uppercase bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your guess..."
            maxLength={currentWord.length}
            onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
          />
        </div>

        <div className="text-center mb-6">
          <button
            onClick={checkGuess}
            disabled={!userGuess.trim()}
            className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold"
          >
            Check Answer
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Hint:</strong> {hint}
          </p>
        </div>

        {gameStatus === 'won' && (
          <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
            <p className="text-green-800 dark:text-green-200 font-bold text-lg">
              🎉 Correct! The word was "{currentWord}"
            </p>
            <button
              onClick={newGame}
              className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next Word
            </button>
          </div>
        )}

        {gameStatus === 'wrong' && (
          <div className="text-center p-4 bg-red-100 dark:bg-red-900 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-bold">
              ❌ Try again!
            </p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={newGame}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            New Word
          </button>
          <button
            onClick={() => setScrambledWord(scrambleWord(currentWord))}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Rescramble
          </button>
        </div>
      </div>
    </div>
  );
};

// Statistics Component
export const Statistics = ({ score, streak, gamesPlayed }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
        Your Statistics
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{gamesPlayed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Games Played</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Score</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Win Streak</div>
        </div>
      </div>
    </div>
  );
};