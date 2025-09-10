import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import CitySelect from './components/CitySelect';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [city, setCity] = useState<string | null>(null);

  const handleLogin = (email: string, password: string) => {
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
    setCity(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <LoginForm onLogin={handleLogin} error={loginError} />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="app">
        <CitySelect onSelect={setCity} />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="welcome-container">
        <h1>Welcome to GotSpot! 🚗</h1>
        <p>Selected city: <strong>{city}</strong></p>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default App;
