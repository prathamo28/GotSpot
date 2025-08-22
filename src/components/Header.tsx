import React from 'react';
import './Header.css';

interface HeaderProps {
  onAddSpot: () => void;
  onLogout: () => void;
  totalSpots: number;
  availableSpots: number;
}

const Header: React.FC<HeaderProps> = ({ onAddSpot, onLogout, totalSpots, availableSpots }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <h1>GotSpot</h1>
          <p>Smart Parking • Gdansk</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{totalSpots}</span>
            <span className="stat-label">Total Spots</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{availableSpots}</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
        
        <div className="header-actions">
          <button onClick={onAddSpot} className="add-spot-button">
            Add Parking Spot
          </button>
          <button onClick={onLogout} className="logout-button">
            Exit Demo
          </button>
        </div>
      </div>
      
      <div className="pilot-banner">
        <span className="pilot-badge">PILOT PROJECT</span>
        <span className="pilot-text">Testing smart parking solution in Gdansk, Poland</span>
      </div>
    </header>
  );
};

export default Header;
