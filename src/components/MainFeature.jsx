import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Simple maze layout (0: wall, 1: path, 2: dot, 3: power pellet, 4: empty)
const initialMaze = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 3, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 3, 0],
  [0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 4, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0],
  [4, 4, 4, 0, 2, 0, 4, 4, 4, 4, 4, 4, 4, 0, 2, 0, 4, 4, 4],
  [0, 0, 0, 0, 2, 0, 4, 0, 0, 4, 0, 0, 4, 0, 2, 0, 0, 0, 0],
  [4, 4, 4, 4, 2, 4, 4, 0, 4, 4, 4, 0, 4, 4, 2, 4, 4, 4, 4],
  [0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 0, 0, 4, 0, 2, 0, 0, 0, 0],
  [4, 4, 4, 0, 2, 0, 4, 4, 4, 4, 4, 4, 4, 0, 2, 0, 4, 4, 4],
  [0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 0, 0, 4, 0, 2, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0],
  [0, 3, 2, 0, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 0, 2, 3, 0],
  [0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0],
  [0, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// Ghost types
const ghostTypes = ['red', 'pink', 'cyan', 'orange'];

function MainFeature({ setHighScore }) {
  // Game state
  const [gameState, setGameState] = useState('start'); // start, playing, paused, gameOver, levelComplete
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [maze, setMaze] = useState(initialMaze);
  
  // Player state
  const [playerPosition, setPlayerPosition] = useState({ x: 9, y: 16 });
  const [playerDirection, setPlayerDirection] = useState('right');
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const [powerUpTimer, setPowerUpTimer] = useState(null);
  
  // Ghost state
  const [ghosts, setGhosts] = useState([
    { id: 'ghost1', type: 'red', position: { x: 9, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
    { id: 'ghost2', type: 'pink', position: { x: 8, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
    { id: 'ghost3', type: 'cyan', position: { x: 10, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
    { id: 'ghost4', type: 'orange', position: { x: 11, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' }
  ]);
  
  // References
  const gameLoopRef = useRef(null);
  const gameBoardRef = useRef(null);
  
  // Icons
  const PlayIcon = getIcon('Play');
  const PauseIcon = getIcon('Pause');
  const RefreshIcon = getIcon('RefreshCw');
  const HeartIcon = getIcon('Heart');

  // Check if a cell is within the maze bounds
  const isWithinBounds = (x, y) => {
    return y >= 0 && y < maze.length && x >= 0 && x < maze[0].length;
  };

  // Check if a cell is a valid path
  const isValidPath = (x, y) => {
    return isWithinBounds(x, y) && maze[y][x] !== 0;
  };

  // Reset game state
  const resetGame = useCallback(() => {
    setGameState('start');
    setScore(0);
    setLevel(1);
    setLives(3);
    setMaze(initialMaze);
    setPlayerPosition({ x: 9, y: 16 });
    setPlayerDirection('right');
    setIsPoweredUp(false);
    if (powerUpTimer) clearTimeout(powerUpTimer);
    setPowerUpTimer(null);
    setGhosts([
      { id: 'ghost1', type: 'red', position: { x: 9, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
      { id: 'ghost2', type: 'pink', position: { x: 8, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
      { id: 'ghost3', type: 'cyan', position: { x: 10, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
      { id: 'ghost4', type: 'orange', position: { x: 11, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' }
    ]);
  }, [powerUpTimer]);

  // Start the game
  const startGame = () => {
    if (gameState === 'start' || gameState === 'gameOver' || gameState === 'levelComplete') {
      setGameState('playing');
      toast.success("Let's go! Use arrow keys to move.", { icon: "🎮" });
    } else if (gameState === 'paused') {
      setGameState('playing');
    } else if (gameState === 'playing') {
      setGameState('paused');
      toast.info("Game paused", { autoClose: 1500 });
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowUp':
          setPlayerDirection('up');
          e.preventDefault();
          break;
        case 'ArrowDown':
          setPlayerDirection('down');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          setPlayerDirection('left');
          e.preventDefault();
          break;
        case 'ArrowRight':
          setPlayerDirection('right');
          e.preventDefault();
          break;
        case 'p':
        case 'P':
          setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
          e.preventDefault();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Move player
  const movePlayer = useCallback(() => {
    let newX = playerPosition.x;
    let newY = playerPosition.y;
    
    switch (playerDirection) {
      case 'up': newY--; break;
      case 'down': newY++; break;
      case 'left': newX--; break;
      case 'right': newX++; break;
      default: break;
    }
    
    if (isValidPath(newX, newY)) {
      // Check what's in the new position
      const cellContent = maze[newY][newX];
      
      // Update score and maze if dot or power pellet is collected
      if (cellContent === 2) { // dot
        setScore(prev => prev + 10);
        const newMaze = [...maze];
        newMaze[newY][newX] = 4; // Mark as empty
        setMaze(newMaze);
      } else if (cellContent === 3) { // power pellet
        setScore(prev => prev + 50);
        const newMaze = [...maze];
        newMaze[newY][newX] = 4; // Mark as empty
        setMaze(newMaze);
        
        // Enable power up
        setIsPoweredUp(true);
        
        // Clear existing timer if there is one
        if (powerUpTimer) clearTimeout(powerUpTimer);
        
        // Set new timer
        const timer = setTimeout(() => {
          setIsPoweredUp(false);
        }, 8000); // 8 seconds power-up
        
        setPowerUpTimer(timer);
        
        // Set all ghosts to frightened mode
        setGhosts(prev => prev.map(ghost => ({
          ...ghost,
          mode: 'frightened',
          isEaten: false
        })));
        
        toast.info("Power-up activated!", { icon: "⚡", autoClose: 2000 });
      }
      
      // Update player position
      setPlayerPosition({ x: newX, y: newY });
    }
  }, [playerPosition, playerDirection, maze, powerUpTimer]);

  // Move ghosts
  const moveGhosts = useCallback(() => {
    setGhosts(prevGhosts => {
      return prevGhosts.map(ghost => {
        // If ghost was eaten, skip movement
        if (ghost.isEaten) return ghost;
        
        const { position, direction } = ghost;
        let possibleDirections = [];
        
        // Check all four directions
        if (isValidPath(position.x, position.y - 1) && direction !== 'down') possibleDirections.push('up');
        if (isValidPath(position.x, position.y + 1) && direction !== 'up') possibleDirections.push('down');
        if (isValidPath(position.x - 1, position.y) && direction !== 'right') possibleDirections.push('left');
        if (isValidPath(position.x + 1, position.y) && direction !== 'left') possibleDirections.push('right');
        
        // Try to keep current direction if possible
        if (possibleDirections.includes(direction)) {
          possibleDirections = [direction];
        }
        
        // Choose a random direction if at intersection
        const newDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)] || direction;
        
        // Calculate new position
        let newX = position.x;
        let newY = position.y;
        
        switch (newDirection) {
          case 'up': newY--; break;
          case 'down': newY++; break;
          case 'left': newX--; break;
          case 'right': newX++; break;
          default: break;
        }
        
        return {
          ...ghost,
          position: { x: newX, y: newY },
          direction: newDirection
        };
      });
    });
  }, []);

  // Check for collisions between player and ghosts
  const checkCollisions = useCallback(() => {
    ghosts.forEach(ghost => {
      if (ghost.isEaten) return;
      
      if (ghost.position.x === playerPosition.x && ghost.position.y === playerPosition.y) {
        if (isPoweredUp) {
          // Player eats ghost
          setScore(prev => prev + 200);
          setGhosts(prevGhosts => prevGhosts.map(g => 
            g.id === ghost.id ? { ...g, isEaten: true } : g
          ));
          toast.success("Ghost eaten! +200", { autoClose: 1500 });
        } else {
          // Player gets eaten
          setLives(prev => prev - 1);
          
          if (lives <= 1) {
            // Game over
            setGameState('gameOver');
            
            // Update high score if needed
            const currentHighScore = localStorage.getItem('highScore') || 0;
            if (score > currentHighScore) {
              localStorage.setItem('highScore', score.toString());
              setHighScore(score);
              toast.success("New high score: " + score + "!", { icon: "🏆" });
            }
            
            toast.error("Game Over!", { icon: "💀" });
          } else {
            // Reset player and ghosts positions
            setPlayerPosition({ x: 9, y: 16 });
            setGhosts([
              { id: 'ghost1', type: 'red', position: { x: 9, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
              { id: 'ghost2', type: 'pink', position: { x: 8, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
              { id: 'ghost3', type: 'cyan', position: { x: 10, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
              { id: 'ghost4', type: 'orange', position: { x: 11, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' }
            ]);
            setGameState('paused');
            toast.warning("Lost a life! Press play to continue.", { icon: "💔" });
          }
        }
      }
    });
  }, [ghosts, playerPosition, isPoweredUp, lives, score, setHighScore]);

  // Check if level is complete (all dots and power pellets collected)
  const checkLevelComplete = useCallback(() => {
    const hasDotsLeft = maze.some(row => row.some(cell => cell === 2 || cell === 3));
    
    if (!hasDotsLeft) {
      setGameState('levelComplete');
      setLevel(prev => prev + 1);
      
      // Reset maze, player and ghosts
      setMaze(initialMaze);
      setPlayerPosition({ x: 9, y: 16 });
      setGhosts([
        { id: 'ghost1', type: 'red', position: { x: 9, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
        { id: 'ghost2', type: 'pink', position: { x: 8, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
        { id: 'ghost3', type: 'cyan', position: { x: 10, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' },
        { id: 'ghost4', type: 'orange', position: { x: 11, y: 10 }, direction: 'up', isEaten: false, mode: 'scatter' }
      ]);
      
      toast.success("Level Complete! Starting level " + (level + 1), { icon: "🎉" });
    }
  }, [maze, level]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      if (gameState === 'playing') {
        movePlayer();
        moveGhosts();
        checkCollisions();
        checkLevelComplete();
      }
    };
    
    if (gameState === 'playing') {
      // Clear existing game loop
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      
      // Set new game loop
      gameLoopRef.current = setInterval(gameLoop, 280 - level * 20); // Speed increases with level
    }
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, movePlayer, moveGhosts, checkCollisions, checkLevelComplete, level]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (powerUpTimer) clearTimeout(powerUpTimer);
    };
  }, [powerUpTimer]);

  // Render cell content
  const renderCell = (cellType, x, y) => {
    const isPlayerCell = playerPosition.x === x && playerPosition.y === y;
    const ghostAtCell = ghosts.find(ghost => ghost.position.x === x && ghost.position.y === y && !ghost.isEaten);
    
    if (isPlayerCell) {
      // Render Pacman
      let rotationClass = "";
      switch(playerDirection) {
        case 'up': rotationClass = "rotate-270"; break;
        case 'down': rotationClass = "rotate-90"; break;
        case 'left': rotationClass = "-scale-x-100"; break;
        default: rotationClass = ""; break;
      }
      
      return (
        <div className={`w-5 h-5 bg-primary rounded-full ${rotationClass}`} style={{
          clipPath: playerDirection === 'up' || playerDirection === 'down' 
            ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' 
            : 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)'
        }}></div>
      );
    } else if (ghostAtCell) {
      // Render Ghost
      const ghostColorClass = isPoweredUp 
        ? "bg-blue-700" 
        : `bg-game-ghost-${ghostAtCell.type}`;
      
      return (
        <div className={`w-5 h-5 ${ghostColorClass} relative`} style={{
          borderRadius: '50% 50% 0 0',
          position: 'relative'
        }}>
          {/* Ghost eyes */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
          
          {/* Ghost "skirt" */}
          <div className="absolute bottom-0 w-full flex">
            <div className="w-1/3 h-1 bg-black rounded-full transform -translate-y-0.5"></div>
            <div className="w-1/3 h-1 bg-black rounded-full transform -translate-y-0.5"></div>
            <div className="w-1/3 h-1 bg-black rounded-full transform -translate-y-0.5"></div>
          </div>
        </div>
      );
    } else {
      switch (cellType) {
        case 0: // Wall
          return <div className="w-full h-full bg-game-wall rounded-sm"></div>;
        case 2: // Dot
          return <div className="w-2 h-2 bg-game-dot rounded-full"></div>;
        case 3: // Power Pellet
          return <div className="w-3 h-3 bg-game-powerPellet rounded-full animate-pulse"></div>;
        default:
          return null;
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-4 md:mt-8">
      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 px-2">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="bg-surface-800 rounded-lg p-2 flex items-center">
            <span className="text-sm md:text-base font-heading text-white mr-2">SCORE:</span>
            <span className="text-primary font-heading text-lg md:text-xl">{score}</span>
          </div>
          
          <div className="bg-surface-800 rounded-lg p-2 flex items-center">
            <span className="text-sm md:text-base font-heading text-white mr-2">LEVEL:</span>
            <span className="text-primary font-heading text-lg md:text-xl">{level}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex">
            {[...Array(lives)].map((_, i) => (
              <HeartIcon key={i} className="w-5 h-5 text-secondary" />
            ))}
          </div>
          
          <button
            className="arcade-btn text-sm px-4 py-2 flex items-center gap-2"
            onClick={startGame}
          >
            {gameState === 'playing' ? (
              <>
                <PauseIcon className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>
          
          <button
            className="arcade-btn-secondary text-sm px-4 py-2"
            onClick={resetGame}
          >
            <RefreshIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Game start overlay */}
      {gameState === 'start' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center p-6 bg-surface-800 rounded-xl max-w-sm">
            <h2 className="text-xl md:text-2xl font-heading text-primary mb-4 neon-text">
              MazeMuncher
            </h2>
            <p className="mb-6 text-sm md:text-base">
              Navigate the maze, collect all dots, and avoid ghosts. Use power pellets to turn the tables!
            </p>
            <button
              className="arcade-btn w-full text-lg"
              onClick={startGame}
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      
      {/* Game over overlay */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center p-6 bg-surface-800 rounded-xl max-w-sm">
            <h2 className="text-xl md:text-2xl font-heading text-secondary mb-4">
              Game Over
            </h2>
            <p className="mb-2">Your Score: <span className="text-primary font-bold">{score}</span></p>
            <p className="mb-6">Level: <span className="text-primary font-bold">{level}</span></p>
            <button
              className="arcade-btn w-full"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {/* Level complete overlay */}
      {gameState === 'levelComplete' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center p-6 bg-surface-800 rounded-xl max-w-sm">
            <h2 className="text-xl md:text-2xl font-heading text-primary mb-4">
              Level Complete!
            </h2>
            <p className="mb-2">Your Score: <span className="text-primary font-bold">{score}</span></p>
            <p className="mb-6">Next Level: <span className="text-primary font-bold">{level}</span></p>
            <button
              className="arcade-btn w-full"
              onClick={startGame}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Game board */}
      <div 
        ref={gameBoardRef}
        className="bg-black border-4 border-game-wall rounded-lg overflow-hidden"
      >
        <div className="grid grid-cols-19 gap-0">
          {maze.map((row, y) => (
            row.map((cell, x) => (
              <div key={`${x}-${y}`} className="game-cell">
                {renderCell(cell, x, y)}
              </div>
            ))
          ))}
        </div>
      </div>
      
      {/* Game controls for mobile */}
      <div className="mt-6 md:hidden flex justify-center">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <button 
            className="bg-surface-800/80 p-3 rounded-lg text-primary"
            onTouchStart={() => setPlayerDirection('up')}
          >
            ↑
          </button>
          <div></div>
          <button 
            className="bg-surface-800/80 p-3 rounded-lg text-primary"
            onTouchStart={() => setPlayerDirection('left')}
          >
            ←
          </button>
          <button 
            className="bg-surface-800/80 p-3 rounded-lg text-primary"
            onTouchStart={() => setPlayerDirection('down')}
          >
            ↓
          </button>
          <button 
            className="bg-surface-800/80 p-3 rounded-lg text-primary"
            onTouchStart={() => setPlayerDirection('right')}
          >
            →
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-center text-gray-400">
        Use arrow keys to move. Collect all dots to complete the level. Power pellets let you eat ghosts!
      </div>
    </div>
  );
}

export default MainFeature;