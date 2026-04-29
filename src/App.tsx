import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import CitySelect from './components/CitySelect';
import CityMapPage from './components/CityMapPage';

const DEMO_EMAIL = process.env.REACT_APP_DEMO_EMAIL || 'demo@gotspot.com';
const DEMO_PASSWORD = process.env.REACT_APP_DEMO_PASSWORD || 'gotspot2025';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [city, setCity] = useState<string | null>(null);
  const [page, setPage] = useState<'login' | 'city' | 'map'>('login');

  const handleLogin = (email: string, password: string) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      setPage('city');
    } else {
      setLoginError('Invalid credentials. Use the demo account shown below.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError('');
    setCity(null);
    setPage('login');
  };

  if (!isAuthenticated || page === 'login') {
    return (
      <div className="app">
        <div className="demo-banner">🚧 DEMO MODE — No real parking data</div>
        <LoginForm onLogin={handleLogin} error={loginError} />
      </div>
    );
  }

  if (page === 'city') {
    return (
      <div className="app">
        <div className="demo-banner">🚧 DEMO MODE — No real parking data</div>
        <CitySelect onSelect={(c) => { setCity(c); setPage('map'); }} />
      </div>
    );
  }

  if (city && page === 'map') {
    return <CityMapPage city={city} onBack={() => setPage('city')} />;
  }

  return (
    <div className="app">
      <div className="welcome-container">
        <h1>Welcome to GotSpot! 🚗</h1>
        <p>Selected city: <strong>{city ?? '—'}</strong></p>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default App;
