import React, { useState, useEffect } from 'react';
import './App.css';

// Simple component for parking spots
interface ParkingSpot {
  id: number;
  name: string;
  address: string;
  available: number;
  total: number;
  price: string;
  type: string;
  rating: number;
  lastUpdated: string;
  distance?: number;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const DEMO_PASSWORD = 'gotspot2025';
  
  const [destination, setDestination] = useState('');
  const [nearbySpots, setNearbySpots] = useState<ParkingSpot[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('gotspot_demo_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('gotspot_demo_auth', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('gotspot_demo_auth');
    setPassword('');
  };

  // Sample parking data for Gdansk
  const allParkingSpots: ParkingSpot[] = [
    {
      id: 1,
      name: "Galeria Przymorze Underground",
      address: "Obrońców Wybrzeża 57, 80-398 Gdansk",
      available: 45,
      total: 800,
      price: "2h free, then 3 PLN/h",
      type: "mall",
      rating: 4.5,
      lastUpdated: "2 min ago"
    },
    {
      id: 2,
      name: "Olivia Centre Parking A",
      address: "Al. Grunwaldzka 472, 80-309 Gdansk",
      available: 12,
      total: 200,
      price: "15min free, then 4 PLN/h",
      type: "office",
      rating: 4.2,
      lastUpdated: "1 min ago"
    },
    {
      id: 3,
      name: "Street Parking - Oliwa Center",
      address: "ul. Cystersów, 80-462 Gdansk",
      available: 3,
      total: 15,
      price: "Free weekends, 2.50 PLN/h weekdays",
      type: "street",
      rating: 3.8,
      lastUpdated: "5 min ago"
    }
  ];

  const popularDestinations = [
    { name: "University of Gdansk", category: "Education" },
    { name: "Galeria Przymorze", category: "Shopping" },
    { name: "Olivia Centre", category: "Business" },
    { name: "Oliwa Cathedral", category: "Tourism" }
  ];

  const findNearbyParking = () => {
    if (!destination.trim()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      setNearbySpots(allParkingSpots);
      setShowResults(true);
      setLoading(false);
    }, 1000);
  };

  const getSpotIcon = (type: string) => {
    switch(type) {
      case 'mall': return '🏬';
      case 'office': return '🏢';
      case 'street': return '🛣️';
      default: return '🅿️';
    }
  };

  const getAvailabilityColor = (available: number) => {
    if (available === 0) return '#dc2626';
    if (available < 5) return '#ca8a04';
    return '#16a34a';
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="app-icon">🚗</div>
            <h1>GotSpot Gdansk</h1>
            <p>Private Demo Access</p>
          </div>

          <div className="login-form">
            <div className="input-group">
              <label>Demo Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className={loginError ? 'error' : ''}
                placeholder="Enter demo password"
              />
              {loginError && (
                <p className="error-message">
                  🔒 Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button onClick={handleLogin} className="login-button">
              🔒 Access Demo
            </button>
          </div>

          <div className="demo-info">
            <h3>Demo Features:</h3>
            <ul>
              <li>• Real-time parking availability</li>
              <li>• Interactive map view</li>
              <li>• Gdansk Przymorze & Oliwa areas</li>
              <li>• Smart destination search</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div>
            <h1>🚗 GotSpot Gdansk</h1>
            <p>Smart parking • Real-time availability</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            🔒 Exit Demo
          </button>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="demo-banner">
        <p>🚧 <strong>Protected Demo Version</strong> - This showcases GotSpot's core features</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-group">
          <label>Where are you going?</label>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="e.g., University of Gdansk, Galeria Przymorze..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && findNearbyParking()}
              disabled={loading}
            />
            <button
              onClick={findNearbyParking}
              disabled={!destination.trim() || loading}
              className="search-button"
            >
              {loading ? '⏳' : '📍'}
            </button>
          </div>
        </div>

        {/* Quick Destinations */}
        <div className="quick-destinations">
          <p>Popular destinations:</p>
          <div className="destination-grid">
            {popularDestinations.map((dest, index) => (
              <button
                key={index}
                onClick={() => {
                  setDestination(dest.name);
                  setTimeout(() => {
                    setNearbySpots(allParkingSpots);
                    setShowResults(true);
                  }, 100);
                }}
                className="destination-button"
                disabled={loading}
              >
                <div className="destination-name">{dest.name}</div>
                <div className="destination-category">{dest.category}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Finding parking spots near {destination}...</p>
        </div>
      )}

      {/* Results Section */}
      {showResults && !loading && (
        <div className="results-section">
          <div className="results-header">
            <h2>🗺️ Near "{destination}"</h2>
            <span className="results-count">{nearbySpots.length} spots found</span>
          </div>
          
          <div className="spots-list">
            {nearbySpots.map(spot => (
              <div key={spot.id} className="spot-card">
                <div className="spot-header">
                  <div className="spot-info">
                    <span className="spot-icon">{getSpotIcon(spot.type)}</span>
                    <div>
                      <h3>{spot.name}</h3>
                      <p className="spot-address">{spot.address}</p>
                      <div className="spot-meta">
                        <span>★ {spot.rating}</span>
                        <span>• {spot.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="availability">
                    <div 
                      className="availability-number"
                      style={{ color: getAvailabilityColor(spot.available) }}
                    >
                      {spot.available}
                    </div>
                    <div className="availability-total">of {spot.total}</div>
                  </div>
                </div>
                
                <div className="spot-details">
                  <div className="spot-price">💰 {spot.price}</div>
                  <div className="spot-actions">
                    <button className="navigate-button">Navigate (Demo)</button>
                    <button className="reserve-button">Reserve (Demo)</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!showResults && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>Find Smart Parking</h3>
          <p>Real-time availability • Best prices • Easy navigation</p>
        </div>
      )}
    </div>
  );
};

export default App;