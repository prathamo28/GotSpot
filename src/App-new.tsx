import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (email: string, password: string) => {
    // Simple demo authentication
    if (email === 'demo@gotspot.com' && password === 'gotspot2025') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password. Use demo@gotspot.com / gotspot2025');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError('');
  };

  if (isAuthenticated) {
    return (
      <div className="app">
        <div className="welcome-container">
          <h1>Welcome to GotSpot! 🚗</h1>
          <p>You are successfully logged in.</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="login-container">
        <div className="logo">
          <h1>GotSpot</h1>
          <p>Find parking spots easily</p>
        </div>
        <LoginForm onLogin={handleLogin} error={loginError} />
      </div>
    </div>
  );
};

export default App;
