import React, { useEffect, useState } from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onStart: (username: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      sessionStorage.setItem('username', username);
      onStart(username);
    }
  };

  return (
    <div className="landing-container">
       <h1 className="landing-title">Spot the Balls</h1>
      <div className="landing-card">     
        <p className="landing-subtitle">Enter your name to get started!</p>
        <form onSubmit={handleSubmit} className="landing-form">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="start-button">
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
