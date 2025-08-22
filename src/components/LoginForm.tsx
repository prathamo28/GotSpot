import React, { useState } from 'react';
import './LoginForm.css';

interface LoginFormProps {
  onLogin: (password: string) => void;
  loginError: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loginError }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="app-icon">🚗</div>
          <h1>GotSpot</h1>
          <p>Smart Parking Solution for Gdansk</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="password">Demo Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter demo password"
              required
            />
          </div>
          
          {loginError && (
            <div className="error-message">
              ❌ Incorrect password. Please try again.
            </div>
          )}
          
          <button type="submit" className="login-button">
            🚀 Launch Demo
          </button>
        </form>
        
        <div className="demo-info">
          <h3>🎯 Demo Features</h3>
          <ul>
            <li>Real Gdansk parking locations</li>
            <li>Live availability updates</li>
            <li>Interactive map view</li>
            <li>Smart search & filtering</li>
            <li>Professional UI/UX</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
