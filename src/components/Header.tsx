import React from 'react';
import './Header.css';

interface HeaderProps {
  onLogout: () => void;
  selectedCity: string;
  availableCities: Array<{ id: string; name: string }>;
}

const Header: React.FC<HeaderProps> = ({ 
  onLogout, 
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
