import React, { useState } from 'react';
import './LoginForm.css';

type OnLoginHandler = ((email: string, password: string) => void) | ((password: string) => void);

interface LoginFormProps {
  onLogin: OnLoginHandler;
  error?: string;
  loginError?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error, loginError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Support both (email, password) and (password) signatures
    const handler = onLogin as any;
    if (typeof handler === 'function') {
      if (handler.length && handler.length >= 2) {
        handler(email, password);
      } else {
        handler(password);
      }
    }
  };

  const errorMessage = error ?? (loginError ? 'Invalid email or password' : '');

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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
          
          <button type="submit" className="login-button">
            Login
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
