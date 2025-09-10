import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import CitySelect from './components/CitySelect';
import CityMapPage from './components/CityMapPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [city, setCity] = useState<string | null>(null);
  const [page, setPage] = useState<'login' | 'city' | 'map'>("login");

  const handleLogin = (email: string, password: string) => {
    if (email === 'demo@gotspot.com' && password === 'gotspot2025') {
      setIsAuthenticated(true);
      setLoginError('');
      setPage('city');
    } else {
      setLoginError('Invalid email or password. Use demo@gotspot.com / gotspot2025');
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
        <LoginForm onLogin={handleLogin} error={loginError} />
      </div>
    );
  }

  if (page === 'city') {
    return (
      <div className="app">
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
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default App;
