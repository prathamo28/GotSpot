import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';
import Payment from './components/Payment';

// Enhanced parking spot interface
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
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
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
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [reservations, setReservations] = useState<string[]>([]);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('gotspot_demo_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default Gdansk location');
          setUserLocation({ lat: 54.3520, lng: 18.6466 });
        }
      );
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

  // Enhanced parking data for Gdansk with real coordinates
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
      lastUpdated: "2 min ago",
      coordinates: { lat: 54.4195, lng: 18.5706 },
      features: ["Covered", "Security", "Shopping", "Restaurants"]
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
      lastUpdated: "1 min ago",
      coordinates: { lat: 54.4156, lng: 18.5712 },
      features: ["Business", "Security", "24/7", "EV Charging"]
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
      lastUpdated: "5 min ago",
      coordinates: { lat: 54.4115, lng: 18.5601 },
      features: ["Street", "Historic", "Tourism", "Free weekends"]
    },
    {
      id: 4,
      name: "University of Gdansk - Main Campus",
      address: "Jana Bażyńskiego 8, 80-309 Gdansk",
      available: 67,
      total: 300,
      price: "Students free, others 2 PLN/h",
      type: "university",
      rating: 4.1,
      lastUpdated: "3 min ago",
      coordinates: { lat: 54.3963, lng: 18.5767 },
      features: ["Education", "Student discount", "Security", "Library"]
    },
    {
      id: 5,
      name: "Manhattan Shopping Center",
      address: "Al. Grunwaldzka 82, 80-244 Gdansk",
      available: 89,
      total: 400,
      price: "1h free, then 3.50 PLN/h",
      type: "mall",
      rating: 4.3,
      lastUpdated: "1 min ago",
      coordinates: { lat: 54.3789, lng: 18.6078 },
      features: ["Shopping", "Cinema", "Food court", "Family"]
    },
    {
      id: 6,
      name: "Medical University of Gdansk",
      address: "Marii Skłodowskiej-Curie 3a, 80-210 Gdansk",
      available: 23,
      total: 150,
      price: "Patients free, visitors 2 PLN/h",
      type: "hospital",
      rating: 4.0,
      lastUpdated: "4 min ago",
      coordinates: { lat: 54.3614, lng: 18.6201 },
      features: ["Medical", "Patient priority", "Security", "24/7"]
    },
    {
      id: 7,
      name: "Gdansk Zoo Parking",
      address: "Karwieńska 3, 80-328 Gdansk",
      available: 156,
      total: 500,
      price: "Free with zoo ticket, 5 PLN/h without",
      type: "attraction",
      rating: 4.4,
      lastUpdated: "2 min ago",
      coordinates: { lat: 54.4147, lng: 18.5478 },
      features: ["Family", "Nature", "Large capacity", "Weekend busy"]
    },
    {
      id: 8,
      name: "Forum Gdansk Underground",
      address: "Targ Sienny 1, 80-806 Gdansk",
      available: 34,
      total: 600,
      price: "2h free, then 4 PLN/h",
      type: "mall",
      rating: 4.6,
      lastUpdated: "1 min ago",
      coordinates: { lat: 54.3556, lng: 18.6494 },
      features: ["Downtown", "Shopping", "Restaurants", "Historic center"]
    }
  ];

  const popularDestinations = [
    { name: "University of Gdansk", category: "Education", coordinates: { lat: 54.3963, lng: 18.5767 } },
    { name: "Galeria Przymorze", category: "Shopping", coordinates: { lat: 54.4195, lng: 18.5706 } },
    { name: "Olivia Centre", category: "Business", coordinates: { lat: 54.4156, lng: 18.5712 } },
    { name: "Oliwa Cathedral", category: "Tourism", coordinates: { lat: 54.4115, lng: 18.5601 } },
    { name: "Gdansk Zoo", category: "Attraction", coordinates: { lat: 54.4147, lng: 18.5478 } },
    { name: "Forum Gdansk", category: "Shopping", coordinates: { lat: 54.3556, lng: 18.6494 } }
  ];

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findNearbyParking = () => {
    if (!destination.trim()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      // Find destination coordinates
      const dest = popularDestinations.find(d => 
        d.name.toLowerCase().includes(destination.toLowerCase()) ||
        destination.toLowerCase().includes(d.name.toLowerCase())
      );
      
      let spotsWithDistance = allParkingSpots;
      
      if (dest) {
        // Calculate distances and sort by proximity
        spotsWithDistance = allParkingSpots.map(spot => ({
          ...spot,
          distance: calculateDistance(
            dest.coordinates.lat, 
            dest.coordinates.lng, 
            spot.coordinates.lat, 
            spot.coordinates.lng
          )
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
      
      setNearbySpots(spotsWithDistance);
      setShowResults(true);
      setLoading(false);
    }, 1000);
  };

  const getSpotIcon = (type: string) => {
    switch(type) {
      case 'mall': return '🏬';
      case 'office': return '🏢';
      case 'street': return '🛣️';
      case 'university': return '🎓';
      case 'hospital': return '🏥';
      case 'attraction': return '🎡';
      default: return '🅿️';
    }
  };

  const getAvailabilityColor = (available: number) => {
    if (available === 0) return '#dc2626';
    if (available < 5) return '#ca8a04';
    if (available < 20) return '#f59e0b';
    return '#16a34a';
  };

  const getFilteredSpots = () => {
    if (selectedFilter === 'all') return nearbySpots;
    return nearbySpots.filter((spot: ParkingSpot) => spot.type === selectedFilter);
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'mall': 'Shopping Center',
      'office': 'Office Building',
      'street': 'Street Parking',
      'university': 'University',
      'hospital': 'Medical Center',
      'attraction': 'Tourist Attraction'
    };
    return labels[type] || type;
  };

  const handleSpotSelect = (spotId: number) => {
    setSelectedSpot(spotId);
    if (viewMode === 'list') {
      setViewMode('map');
    }
  };

  const handleReserveSpot = (spotId: number) => {
    setSelectedSpot(spotId);
    setShowPayment(true);
  };

  const handlePaymentComplete = (reservationId: string) => {
    setReservations((prev: string[]) => [...prev, reservationId]);
    setShowPayment(false);
    setSelectedSpot(null);
    // In real app, update parking spot availability
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="app-icon">🚗</div>
            <h1>GotSpot Gdansk</h1>
            <p>Smart Parking Solution • Private Demo</p>
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
            <h3>🚀 Demo Features:</h3>
            <ul>
              <li>• 8 real Gdansk parking locations</li>
              <li>• Interactive map with real-time updates</li>
              <li>• Smart destination search & navigation</li>
              <li>• In-app payment & reservation system</li>
              <li>• Professional investor-ready demo</li>
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
            <p>Smart parking • Real-time availability • 8 locations</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            🔒 Exit Demo
          </button>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="demo-banner">
        <p>🚧 <strong>Protected Demo Version</strong> - Showcasing GotSpot's core features for investors</p>
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
                    const spotsWithDistance = allParkingSpots.map(spot => ({
                      ...spot,
                      distance: calculateDistance(
                        dest.coordinates.lat, 
                        dest.coordinates.lng, 
                        spot.coordinates.lat, 
                        spot.coordinates.lng
                      )
                    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
                    setNearbySpots(spotsWithDistance);
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
            <span className="results-count">{getFilteredSpots().length} spots found</span>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List View
            </button>
            <button
              className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              🗺️ Map View
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All ({nearbySpots.length})
            </button>
            <button
              className={`filter-tab ${selectedFilter === 'mall' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('mall')}
            >
              Shopping ({nearbySpots.filter((s: ParkingSpot) => s.type === 'mall').length})
            </button>
            <button
              className={`filter-tab ${selectedFilter === 'university' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('university')}
            >
              Education ({nearbySpots.filter((s: ParkingSpot) => s.type === 'university').length})
            </button>
            <button
              className={`filter-tab ${selectedFilter === 'street' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('street')}
            >
              Street ({nearbySpots.filter((s: ParkingSpot) => s.type === 'street').length})
            </button>
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="map-view">
              <Map
                parkingSpots={getFilteredSpots()}
                selectedSpot={selectedSpot}
                onSpotSelect={handleSpotSelect}
                userLocation={userLocation}
              />
            </div>
          )}
          
          {/* List View */}
          {viewMode === 'list' && (
            <div className="spots-list">
              {getFilteredSpots().map(spot => (
                <div key={spot.id} className="spot-card">
                  <div className="spot-header">
                    <div className="spot-info">
                      <span className="spot-icon">{getSpotIcon(spot.type)}</span>
                      <div>
                        <h3>{spot.name}</h3>
                        <p className="spot-address">{spot.address}</p>
                        <div className="spot-meta">
                          <span className="spot-type">{getTypeLabel(spot.type)}</span>
                          <span>★ {spot.rating}</span>
                          <span>• {spot.lastUpdated}</span>
                          {spot.distance && (
                            <span>• {spot.distance.toFixed(1)} km</span>
                          )}
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
                  
                  {/* Features */}
                  <div className="spot-features">
                    {spot.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  
                  <div className="spot-details">
                    <div className="spot-price">💰 {spot.price}</div>
                    <div className="spot-actions">
                      <button 
                        className="navigate-button"
                        onClick={() => handleSpotSelect(spot.id)}
                      >
                        🗺️ View on Map
                      </button>
                      <button 
                        className="reserve-button"
                        onClick={() => handleReserveSpot(spot.id)}
                        disabled={spot.available === 0}
                      >
                        💳 Reserve & Pay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!showResults && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>Find Smart Parking in Gdansk</h3>
          <p>Real-time availability • Interactive maps • Easy payments</p>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">8</div>
              <div className="stat-label">Parking Locations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2,350+</div>
              <div className="stat-label">Total Spots</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Real-time</div>
              <div className="stat-label">Updates</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && selectedSpot && (
        <div className="modal-overlay">
          <Payment
            parkingSpot={allParkingSpots.find(s => s.id === selectedSpot)!}
            onPaymentComplete={handlePaymentComplete}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      )}

      {/* Reservations */}
      {reservations.length > 0 && (
        <div className="reservations-banner">
          <p>🎉 You have {reservations.length} active reservation(s)</p>
        </div>
      )}
    </div>
  );
};

export default App;