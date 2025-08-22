import React from 'react';
import './Header.css';

interface HeaderProps {
  onLogout: () => void;
  totalSpots: number;
  availableSpots: number;
  selectedCity: string;
  availableCities: Array<{ id: string; name: string }>;
}

const Header: React.FC<HeaderProps> = ({ 
  onLogout, 
  totalSpots, 
  availableSpots, 
  selectedCity,
  availableCities 
}) => {
  const cityName = availableCities.find(c => c.id === selectedCity)?.name || 'Gdańsk';

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <h1>GotSpot</h1>
          <p>SMART PARKING • {cityName.toUpperCase()}</p>
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
          <button 
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
