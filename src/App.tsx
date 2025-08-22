import React, { useState, useEffect, useMemo } from 'react';
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
  images?: string[];
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
  const [detailsSpotId, setDetailsSpotId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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

  // Enhanced parking data for Gdansk with real coordinates - Organized by area
  const baseParkingSpots: ParkingSpot[] = [
    // GDANSK OLD TOWN AREA (Historic Center)
    {
      id: 1,
      name: "Piastowska Street Parking",
      address: "Piastowska, 80-332 Gdańsk",
      available: 8,
      total: 25,
      price: "3 PLN/h, free after 18:00",
      type: "street",
      rating: 4.2,
      lastUpdated: "1 min ago",
      coordinates: { lat: 54.3520, lng: 18.6466 },
      features: ["Historic", "Old Town", "Tourism", "Evening free"],
      images: [
        'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    {
      id: 2,
      name: "Czerwony Dwór Parking Zone",
      address: "Czerwony Dwór, 80-383 Gdańsk",
      available: 15,
      total: 40,
      price: "2.50 PLN/h, 15 PLN/day",
      type: "street",
      rating: 4.0,
      lastUpdated: "2 min ago",
      coordinates: { lat: 54.3540, lng: 18.6480 },
      features: ["Historic", "Old Town", "Daily rate", "Tourism"],
      images: [
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    {
      id: 3,
      name: "Sambora Street Parking",
      address: "Sambora, 80-361 Gdańsk",
      available: 12,
      total: 30,
      price: "2 PLN/h, free weekends",
      type: "street",
      rating: 3.9,
      lastUpdated: "3 min ago",
      coordinates: { lat: 54.3530, lng: 18.6470 },
      features: ["Historic", "Old Town", "Weekend free", "Tourism"],
      images: [
        'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    {
      id: 4,
      name: "Plac Dworcowy Station Parking",
      address: "Plac Dworcowy, 80-321 Gdańsk",
      available: 45,
      total: 120,
      price: "4 PLN/h, 20 PLN/day",
      type: "transport",
      rating: 4.1,
      lastUpdated: "1 min ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Train station", "Transport hub", "24/7", "Daily rate"],
      images: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    
    // SHOPPING & BUSINESS AREAS
    {
      id: 5,
      name: "Forum Gdansk Underground",
      address: "Targ Sienny 1, 80-806 Gdańsk",
      available: 34,
      total: 600,
      price: "2h free, then 4 PLN/h",
      type: "mall",
      rating: 4.6,
      lastUpdated: "1 min ago",
      coordinates: { lat: 54.3556, lng: 18.6494 },
      features: ["Downtown", "Shopping", "Restaurants", "Historic center"],
      images: [
        'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    {
      id: 6,
      name: "Manhattan Shopping Center",
      address: "Al. Grunwaldzka 82, 80-244 Gdańsk",
      available: 89,
      total: 400,
      price: "1h free, then 3.50 PLN/h",
      type: "mall",
      rating: 4.3,
      lastUpdated: "1 min ago",
      coordinates: { lat: 54.3789, lng: 18.6078 },
      features: ["Shopping", "Cinema", "Food court", "Family"],
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    
    // EDUCATIONAL & MEDICAL AREAS
    {
      id: 7,
      name: "University of Gdansk - Main Campus",
      address: "Jana Bażyńskiego 8, 80-309 Gdańsk",
      available: 67,
      total: 300,
      price: "Students free, others 2 PLN/h",
      type: "university",
      rating: 4.1,
      lastUpdated: "3 min ago",
      coordinates: { lat: 54.3963, lng: 18.5767 },
      features: ["Education", "Student discount", "Security", "Library"],
      images: [
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop'
      ]
    },
    {
      id: 8,
      name: "Medical University of Gdansk",
      address: "Marii Skłodowskiej-Curie 3a, 80-210 Gdańsk",
      available: 23,
      total: 150,
      price: "Patients free, visitors 2 PLN/h",
      type: "hospital",
      rating: 4.0,
      lastUpdated: "4 min ago",
      coordinates: { lat: 54.3614, lng: 18.6201 },
      features: ["Medical", "Patient priority", "Security", "24/7"],
      images: [
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop'
      ]
    }
  ];

  // Generate additional demo spots around Gdansk for recommendations
  const generateAdditionalSpots = (seed: ParkingSpot[], count: number): ParkingSpot[] => {
    const results: ParkingSpot[] = [];
    const baseLat = 54.3722; // Gdansk approx
    const baseLng = 18.6389;
    const types = ['mall', 'office', 'street', 'university', 'hospital', 'attraction'];
    for (let i = 0; i < count; i++) {
      const id = seed.length + i + 1;
      const lat = baseLat + ((i % 10) - 5) * 0.005 + (i * 0.0007);
      const lng = baseLng + ((Math.floor(i / 10) % 10) - 5) * 0.006 + (i * 0.0005);
      const type = types[i % types.length];
      const available = Math.max(0, (i * 7) % 120);
      const total = 80 + (i % 12) * 20;
      const priceTier = (i % 4) + 1; // 1..4
      const price = priceTier === 1 ? 'Free' : `${priceTier + 1} PLN/h`;
      results.push({
        id,
        name: `Gdansk Parking Zone ${id}`,
        address: `Auto-generated location #${id}, Gdansk`,
        available,
        total,
        price,
        type,
        rating: 3.5 + (i % 15) / 10,
        lastUpdated: `${(i % 5) + 1} min ago`,
        coordinates: { lat, lng },
        features: ['Lighting', 'Cameras', 'Open 24/7'],
        images: [
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1200&auto=format&fit=crop'
        ]
      });
    }
    return results;
  };

  const allParkingSpots: ParkingSpot[] = useMemo(() => {
    const extras = generateAdditionalSpots(baseParkingSpots, 52); // base 8 + 52 = 60+
    return [...baseParkingSpots, ...extras];
  }, []);

  const popularDestinations = [
    // GDANSK OLD TOWN AREA
    { name: "Piastowska", category: "Old Town", coordinates: { lat: 54.3520, lng: 18.6466 } },
    { name: "Czerwony Dwór", category: "Old Town", coordinates: { lat: 54.3540, lng: 18.6480 } },
    { name: "Sambora", category: "Old Town", coordinates: { lat: 54.3530, lng: 18.6470 } },
    { name: "Plac Dworcowy", category: "Transport", coordinates: { lat: 54.3550, lng: 18.6450 } },
    
    // SHOPPING & BUSINESS
    { name: "Forum Gdansk", category: "Shopping", coordinates: { lat: 54.3556, lng: 18.6494 } },
    { name: "Manhattan Shopping", category: "Shopping", coordinates: { lat: 54.3789, lng: 18.6078 } },
    
    // EDUCATIONAL & MEDICAL
    { name: "University of Gdansk", category: "Education", coordinates: { lat: 54.3963, lng: 18.5767 } },
    { name: "Medical University", category: "Medical", coordinates: { lat: 54.3614, lng: 18.6201 } }
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
    // Return empty string for professional look
    return '';
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

  // NEW: Get price category and color for parking spots
  const getPriceCategory = (price: string) => {
    // Extract hourly rate from price string
    const hourlyRate = parseFloat(price.match(/(\d+(?:\.\d+)?)/)?.[1] || '0');
    
    if (hourlyRate === 0) return { category: 'Free', color: '#16a34a', bgColor: '#dcfce7' };
    if (hourlyRate <= 2) return { category: 'Cheap', color: '#ca8a04', bgColor: '#fef3c7' };
    if (hourlyRate <= 4) return { category: 'Moderate', color: '#ea580c', bgColor: '#fed7aa' };
    return { category: 'Expensive', color: '#dc2626', bgColor: '#fee2e2' };
  };

  const handleSpotSelect = (spotId: number) => {
    // Map selection only when in map context
    setSelectedSpot(spotId);
  };

  const openSpotDetails = (spotId: number) => {
    setDetailsSpotId(spotId);
    setShowDetails(true);
  };

  const closeSpotDetails = () => {
    setShowDetails(false);
    setDetailsSpotId(null);
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
            <div className="app-icon">G</div>
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
             <h3>Demo Features:</h3>
             <ul>
               <li>• 4 real Gdansk Old Town street locations</li>
               <li>• Interactive map with real-time updates</li>
               <li>• Smart destination search & nearby parking</li>
               <li>• Color-coded pricing system</li>
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
             <h1>GotSpot Gdansk</h1>
             <p>Smart parking • Real-time availability • Old Town focus</p>
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
               placeholder="e.g., Piastowska, Czerwony Dwór, Sambora, Plac Dworcowy..."
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

        {/* Quick Destinations - COMMENTED OUT - Replaced with nearby search functionality */}
        {/*
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
                <div className="destination-name">{dest.name}</div>
                <div className="destination-category">{dest.category}</div>
              </button>
            ))}
          </div>
        </div>
        */}
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

          {/* Filter Tabs - removed as per request */}
          {false && (
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
          )}

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
          
          {/* List View - UPDATED: Simplified with price categories and click opens details */}
          {viewMode === 'list' && (
            <div className="spots-list">
              {getFilteredSpots().map(spot => {
                const priceInfo = getPriceCategory(spot.price);
                return (
                  <div key={spot.id} className="spot-card" onClick={() => openSpotDetails(spot.id)}>
                    <div className="spot-header">
                      <div className="spot-info">
                        <span className="spot-icon">{getSpotIcon(spot.type)}</span>
                        <div>
                          <h3>{spot.name}</h3>
                          <div className="spot-meta">
                            <span className="spot-type">{getTypeLabel(spot.type)}</span>
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
                    
                    {/* Price Category Badge */}
                                          <div className="price-category-badge" style={{
                        backgroundColor: priceInfo.bgColor,
                        color: priceInfo.color,
                        border: `1px solid ${priceInfo.color}`
                      }}>
                        {priceInfo.category} • {spot.price}
                      </div>
                    
                                          {/* Click to view details hint */}
                      <div className="click-hint">
                        Click to view full details
                      </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!showResults && !loading && (
                 <div className="empty-state">
           <div className="empty-icon">!</div>
           <h3>Find Smart Parking in Gdansk Old Town</h3>
           <p>Real-time availability • Interactive maps • Color-coded pricing</p>
           <div className="stats-grid">
             <div className="stat-item">
               <div className="stat-number">4</div>
               <div className="stat-label">Old Town Streets</div>
             </div>
             <div className="stat-item">
               <div className="stat-number">215+</div>
               <div className="stat-label">Total Spots</div>
             </div>
             <div className="stat-item">
               <div className="stat-number">Real-time</div>
               <div className="stat-label">Updates</div>
             </div>
           </div>
         </div>
      )}

      {/* Spot Details Modal */}
      {showDetails && detailsSpotId && (
        <div className="modal-overlay" onClick={closeSpotDetails}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const spot = allParkingSpots.find(s => s.id === detailsSpotId)!;
              const priceInfo = getPriceCategory(spot.price);
              return (
                <>
                  <div className="details-header">
                    <h3>{spot.name}</h3>
                    <button className="close-button" onClick={closeSpotDetails}>✕</button>
                  </div>
                  {spot.images && spot.images.length > 0 && (
                    <div className="details-gallery">
                      {spot.images.slice(0,3).map((src, idx) => (
                        <img key={idx} src={src} alt={`${spot.name} ${idx+1}`} />
                      ))}
                    </div>
                  )}
                  <div className="details-meta">
                    <span className="spot-type">{getTypeLabel(spot.type)}</span>
                    {spot.distance && <span className="meta-pill">{spot.distance.toFixed(1)} km away</span>}
                    <span className="meta-pill">{spot.rating} ★</span>
                    <span className="meta-pill">Updated {spot.lastUpdated}</span>
                  </div>
                  <div className="details-address">{spot.address}</div>
                  <div className="details-price">
                    <div className="price-category-badge" style={{ 
                      backgroundColor: priceInfo.bgColor, color: priceInfo.color, border: `1px solid ${priceInfo.color}`
                    }}>
                      {priceInfo.category} • {spot.price}
                    </div>
                    <div className="availability-inline">
                      <span className="availability-number" style={{ color: getAvailabilityColor(spot.available) }}>{spot.available}</span>
                      <span className="availability-total">of {spot.total} available</span>
                    </div>
                  </div>
                  <div className="details-features">
                    {spot.features.map((f, i) => (
                      <span key={i} className="feature-tag">{f}</span>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Payment Modal - COMMENTED OUT - Removed for now */}
      {/*
      {showPayment && selectedSpot && (
        <div className="modal-overlay">
          <Payment
            parkingSpot={allParkingSpots.find(s => s.id === selectedSpot)!}
            onPaymentComplete={handlePaymentComplete}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      )}
      */}

      {/* Reservations - COMMENTED OUT - Removed for now */}
      {/*
      {reservations.length > 0 && (
        <div className="reservations-banner">
          <p>🎉 You have {reservations.length} active reservation(s)</p>
        </div>
      )}
      */}
    </div>
  );
};

export default App;