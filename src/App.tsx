import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import LandingPage from './LandingPage';

const MAX_BALLS = 5;

interface Ball {
  id: number;
  x: string;
  y: string;
  color: string;
}

interface GamePageProps {
  onBack: () => void;
}

const GamePage: React.FC<GamePageProps> = ({ onBack }) => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [ballCount, setBallCount] = useState<number>(0);
  const [showResultMessage, setShowResultMessage] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [round, setRound] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Function to generate a random color
  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getRandomBubbleColor = (): string => {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return `radial-gradient(circle, ${color1}, ${color2})`;
  };

  const addBall = useCallback(() => {
    const newBall: Ball = {
      id: Date.now(),
      x: Math.random() * 90 + '%',
      y: Math.random() * 90 + '%',
      color: getRandomBubbleColor(),
    };

    setBalls((prevBalls) => [...prevBalls, newBall]);
    setBallCount((prevCount) => prevCount + 1);

    setTimeout(() => {
      setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== newBall.id));
    }, 3000);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername);
  
    if (gameRunning && ballCount < MAX_BALLS) {
      interval = setInterval(() => {
        addBall();
      }, 1000);
    } else if (ballCount >= MAX_BALLS) {
      setTimeout(() => {
        setGameRunning(false);
        setShowResultMessage(true);
        setGameOver(true);
      }, 3000); // Wait for 3 seconds after the last ball appears
    }
  
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameRunning, ballCount, addBall, score]);
  
  const handleBallClick = (id: number) => {
    setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== id));
    setScore((prevScore) => prevScore + 1);
  };

  const startGame = () => {
    setBalls([]);
    setScore(0);
    setBallCount(0);
    setGameRunning(true);
    setShowResultMessage(false);
    setGameOver(false);
  };

  // Hide the result message after 5 seconds
  useEffect(() => {
    if (showResultMessage) {
      const timer = setTimeout(() => {
        setShowResultMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showResultMessage]);

  const nextRound = () => {
    setRound((prevRound) => prevRound + 1);
    startGame();
  };


  return (
    <div className="app">
      <div className='welcome-title'>Welcome, {username}!</div>
      <p>Let's play the game! Round {round}</p>
      <button className={`back-button ${gameRunning ? 'running' : ''}`} onClick={onBack} disabled={gameRunning}>
        Back
      </button>
      <button className={`start-button ${gameRunning ? 'running' : ''}`} onClick={startGame} disabled={gameRunning}>
        Start
      </button>
      {!gameRunning && gameOver && (
        <div>
          <h2>Score: {score}</h2>
        </div>
      )}
      {showResultMessage && (
          <p className="result-message">Game Over! You clicked {score} balls out of {MAX_BALLS}.</p>
      )}
     {!gameRunning && gameOver && (
        <button className="next-round-button" onClick={nextRound}>
          Next Round
        </button>
      )}
       {gameRunning && (
      <div className="game-area">
        {balls.map((ball) => (
          <div
            key={ball.id}
            className="ball"
            style={{ top: ball.y, left: ball.x, backgroundColor: ball.color }}
            onClick={() => handleBallClick(ball.id)}
          ></div>
        ))}
      </div>
       )}
    </div>
  );
};

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  return (
    <div className="app">
      {!username ? (
        <LandingPage onStart={(name) => setUsername(name)} />
      ) : (
        <GamePage onBack={() => setUsername(null)} />
      )}
    </div>
  );
};

export default App;
