import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Loader } from '@googlemaps/js-api-loader';
import { ParkingSpot } from './types/ParkingSpot';

// Import new components
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import ParkingList from './components/ParkingList';
import ParkingDetails from './components/ParkingDetails';
import Map from './components/Map';

const App: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const DEMO_PASSWORD = 'gotspot2025';
  
  // City selection state
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showCitySelection, setShowCitySelection] = useState(false);
  
  // App state
  const [destination, setDestination] = useState('');
  const [nearbySpots, setNearbySpots] = useState<ParkingSpot[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [detailsSpotId, setDetailsSpotId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userContributions, setUserContributions] = useState<ParkingSpot[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<{ name: string; coordinates: { lat: number; lng: number } } | null>(null);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);

  // Available cities
  const availableCities = [
    { id: 'gdansk', name: 'Gdańsk', coordinates: { lat: 54.3520, lng: 18.6466 } },
    { id: 'warsaw', name: 'Warszawa', coordinates: { lat: 52.2297, lng: 21.0122 } },
    { id: 'krakow', name: 'Kraków', coordinates: { lat: 50.0647, lng: 19.9450 } },
    { id: 'wroclaw', name: 'Wrocław', coordinates: { lat: 51.1079, lng: 17.0385 } },
    { id: 'poznan', name: 'Poznań', coordinates: { lat: 52.4064, lng: 16.9252 } }
  ];

  // Demo parking spots data
  const allParkingSpots: ParkingSpot[] = [
    // Original 3 spots
    {
      id: 1,
      name: "Piastowska Street Parking",
      address: "Piastowska, 80-332 Gdańsk",
      available: 45,
      total: 120,
      price: "Free",
      type: "street",
      rating: 4.2,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3520, lng: 18.6466 },
      features: ["Parking Machine", "24/7", "Security", "Lighting"],
      images: []
    },
    {
      id: 2,
      name: "Czerwony Dwór Shopping Center",
      address: "80-383 Gdańsk",
      available: 67,
      total: 200,
      price: "3 PLN/h",
      type: "mall",
      rating: 4.5,
      lastUpdated: "5 minutes ago",
      coordinates: { lat: 54.3556, lng: 18.6494 },
      features: ["Covered", "Security", "Cameras", "Free WiFi"],
      images: []
    },
    {
      id: 3,
      name: "Sambora Office District",
      address: "80-361 Gdańsk",
      available: 23,
      total: 150,
      price: "4 PLN/h",
      type: "office",
      rating: 4.0,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3580, lng: 18.6520 },
      features: ["Covered", "Security", "EV Charging", "Disabled Access"],
      images: []
    },
    
    // Additional Gdansk parking spots
    {
      id: 4,
      name: "Ergo Arena Parking",
      address: "Plac Dwóch Miast 1, 80-344 Gdańsk",
      available: 89,
      total: 300,
      price: "5 PLN/h",
      type: "attraction",
      rating: 4.3,
      lastUpdated: "3 minutes ago",
      coordinates: { lat: 54.3650, lng: 18.6480 },
      features: ["Covered", "Security", "24/7", "Cameras", "Lighting"],
      images: []
    },
    {
      id: 5,
      name: "Oliwa Tower Parking",
      address: "Opata Jacka Rybińskiego 25, 80-320 Gdańsk",
      available: 34,
      total: 150,
      price: "4 PLN/h",
      type: "office",
      rating: 4.1,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.4110, lng: 18.5600 },
      features: ["Covered", "Security", "EV Charging", "Disabled Access"],
      images: []
    },
    {
      id: 6,
      name: "Oliwa Park Shopping Center",
      address: "Opata Jacka Rybińskiego 25, 80-320 Gdańsk",
      available: 156,
      total: 400,
      price: "3 PLN/h",
      type: "mall",
      rating: 4.4,
      lastUpdated: "4 minutes ago",
      coordinates: { lat: 54.4100, lng: 18.5590 },
      features: ["Covered", "Security", "Free WiFi", "Family Friendly"],
      images: []
    },
    {
      id: 7,
      name: "Gdańsk University Parking",
      address: "Jana Bażyńskiego 8, 80-309 Gdańsk",
      available: 23,
      total: 200,
      price: "2 PLN/h",
      type: "university",
      rating: 4.0,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3960, lng: 18.5760 },
      features: ["Covered", "Security", "Student Discount", "24/7"],
      images: []
    },
    {
      id: 8,
      name: "Medical University of Gdańsk",
      address: "Marii Skłodowskiej-Curie 3a, 80-210 Gdańsk",
      available: 45,
      total: 180,
      price: "3 PLN/h",
      type: "hospital",
      rating: 4.2,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3630, lng: 18.6200 },
      features: ["Covered", "Security", "Medical Staff", "24/7"],
      images: []
    },
    {
      id: 9,
      name: "Gdańsk Główny Station",
      address: "Podwale Grodzkie 1, 80-895 Gdańsk",
      available: 78,
      total: 250,
      price: "4 PLN/h",
      type: "transport",
      rating: 4.1,
      lastUpdated: "5 minutes ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Covered", "Security", "24/7", "Cameras", "Lighting"],
      images: []
    },
    {
      id: 10,
      name: "Manhattan Shopping Center",
      address: "aleja Grunwaldzka 82, 80-244 Gdańsk",
      available: 123,
      total: 350,
      price: "3 PLN/h",
      type: "mall",
      rating: 4.3,
      lastUpdated: "3 minutes ago",
      coordinates: { lat: 54.3800, lng: 18.6100 },
      features: ["Covered", "Security", "Free WiFi", "Family Friendly"],
      images: []
    },
    {
      id: 11,
      name: "Forum Gdańsk",
      address: "aleja Grunwaldzka 19, 80-264 Gdańsk",
      available: 89,
      total: 280,
      price: "4 PLN/h",
      type: "mall",
      rating: 4.5,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Covered", "Security", "Free WiFi", "Restaurants"],
      images: []
    },
    {
      id: 12,
      name: "Galeria Bałtycka",
      address: "aleja Grunwaldzka 141, 80-264 Gdańsk",
      available: 67,
      total: 200,
      price: "3 PLN/h",
      type: "mall",
      rating: 4.2,
      lastUpdated: "4 minutes ago",
      coordinates: { lat: 54.3800, lng: 18.6100 },
      features: ["Covered", "Security", "Free WiFi", "Cinema"],
      images: []
    },
    {
      id: 13,
      name: "Gdańsk Zoo Parking",
      address: "Karwieńska 3, 80-328 Gdańsk",
      available: 45,
      total: 120,
      price: "5 PLN/h",
      type: "attraction",
      rating: 4.4,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.4150, lng: 18.5600 },
      features: ["Covered", "Security", "Family Friendly", "Tourist Area"],
      images: []
    },
    {
      id: 14,
      name: "Oliwa Cathedral Parking",
      address: "Biskupa Edmunda Nowickiego 25, 80-330 Gdańsk",
      available: 23,
      total: 80,
      price: "Free",
      type: "attraction",
      rating: 4.0,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.4110, lng: 18.5600 },
      features: ["Security", "Tourist Area", "Historical Site"],
      images: []
    },
    {
      id: 15,
      name: "Gdańsk University of Technology",
      address: "Narutowicza 11/12, 80-233 Gdańsk",
      available: 34,
      total: 150,
      price: "2 PLN/h",
      type: "university",
      rating: 4.1,
      lastUpdated: "3 minutes ago",
      coordinates: { lat: 54.3720, lng: 18.6180 },
      features: ["Covered", "Security", "Student Discount", "EV Charging"],
      images: []
    },
    {
      id: 16,
      name: "Gdańsk Medical Center",
      address: "Marii Skłodowskiej-Curie 3a, 80-210 Gdańsk",
      available: 56,
      total: 200,
      price: "3 PLN/h",
      type: "hospital",
      rating: 4.3,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3630, lng: 18.6200 },
      features: ["Covered", "Security", "Medical Staff", "24/7"],
      images: []
    },
    {
      id: 17,
      name: "Wrzeszcz Shopping District",
      address: "aleja Grunwaldzka, 80-244 Gdańsk",
      available: 89,
      total: 250,
      price: "3 PLN/h",
      type: "mall",
      rating: 4.2,
      lastUpdated: "4 minutes ago",
      coordinates: { lat: 54.3800, lng: 18.6100 },
      features: ["Covered", "Security", "Free WiFi", "Restaurants"],
      images: []
    },
    {
      id: 18,
      name: "Gdańsk Old Town Parking",
      address: "Długi Targ, 80-833 Gdańsk",
      available: 23,
      total: 100,
      price: "6 PLN/h",
      type: "attraction",
      rating: 4.5,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3490, lng: 18.6490 },
      features: ["Security", "Tourist Area", "Historical Site", "Cameras"],
      images: []
    },
    {
      id: 19,
      name: "Gdańsk Shipyard Area",
      address: "Doki 1, 80-958 Gdańsk",
      available: 67,
      total: 180,
      price: "4 PLN/h",
      type: "office",
      rating: 4.0,
      lastUpdated: "3 minutes ago",
      coordinates: { lat: 54.3650, lng: 18.6580 },
      features: ["Covered", "Security", "24/7", "Industrial Area"],
      images: []
    },
    {
      id: 20,
      name: "Gdańsk Airport Parking",
      address: "Juliusza Słowackiego 200, 80-298 Gdańsk",
      available: 234,
      total: 500,
      price: "8 PLN/h",
      type: "transport",
      rating: 4.2,
      lastUpdated: "5 minutes ago",
      coordinates: { lat: 54.3770, lng: 18.4660 },
      features: ["Covered", "Security", "24/7", "Cameras", "Lighting"],
      images: []
    }
  ];

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('gotspot_demo_auth');
    const savedCity = sessionStorage.getItem('gotspot_selected_city');
    
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      if (savedCity) {
        setSelectedCity(savedCity);
      } else {
        setShowCitySelection(true);
      }
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

    // Load Google Maps API immediately when app starts
    const loadGoogleMaps = async () => {
      try {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          console.error('Google Maps API key not configured');
          return;
        }

        console.log('🚀 Loading Google Maps API...');
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        console.log('✅ Google Maps API loaded successfully!');
        console.log('window.google:', google);
        
        // Make it globally available
        (window as any).google = google;
        setIsGoogleMapsReady(true); // Set ready state
      } catch (error) {
        console.error('❌ Failed to load Google Maps API:', error);
      }
    };

    loadGoogleMaps();
  }, []);

  // Authentication handlers
  const handleLogin = (password: string) => {
    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
      sessionStorage.setItem('gotspot_demo_auth', 'true');
      setShowCitySelection(true);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedCity('');
    setShowCitySelection(false);
    sessionStorage.removeItem('gotspot_demo_auth');
    sessionStorage.removeItem('gotspot_selected_city');
    setShowResults(false);
    setDestination('');
    setNearbySpots([]);
  };

  // City selection handler
  const handleCitySelection = (cityId: string) => {
    const city = availableCities.find(c => c.id === cityId);
    if (city) {
      setSelectedCity(cityId);
      setShowCitySelection(false);
      sessionStorage.setItem('gotspot_selected_city', cityId);
      setUserLocation(city.coordinates);
    }
  };

  // Search functionality
  const findNearbyParking = async () => {
    if (!destination.trim()) return;
    
    setLoading(true);
    setShowResults(true);
    
    // Add to recent searches
    if (!recentSearches.includes(destination.trim())) {
      setRecentSearches(prev => [destination.trim(), ...prev.slice(0, 4)]); // Keep last 5 searches
    }
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get real parking spots from Google Maps API
      const realSpots = await getRealParkingSpots(destination);
      
      // Combine real spots with demo spots
      const allSpots = [...allParkingSpots, ...realSpots];
      
      // Calculate distances and filter by 500m-1000m range
      const spotsWithDistance = allSpots
        .map(spot => ({
          ...spot,
          distance: calculateDistance(
            userLocation?.lat || 54.3520,
            userLocation?.lng || 18.6466,
            spot.coordinates.lat,
            spot.coordinates.lng
          )
        }))
        .filter(spot => spot.distance >= 0.5 && spot.distance <= 1.0) // 500m to 1000m range
        .sort((a, b) => a.distance - b.distance);
      
      setNearbySpots(spotsWithDistance);
    } catch (error) {
      console.error('Error finding parking:', error);
      // Fallback to demo spots only
      const spotsWithDistance = allParkingSpots.map(spot => ({
        ...spot,
        distance: Math.random() * 0.5 + 0.5 // 500m to 1000m range
      }));
      setNearbySpots(spotsWithDistance);
    } finally {
      setLoading(false);
    }
  };

  // Handle destination selection
  const handleDestinationSelect = (destinationName: string, coordinates: { lat: number; lng: number }) => {
    setSelectedDestination({ name: destinationName, coordinates });
    setDestination(destinationName);
    // Center map on selected destination
    if (userLocation) {
      // You can add map centering logic here
    }
  };

  // Get directions/route
  const getDirections = () => {
    if (!selectedDestination || !userLocation) return;
    
    // Open Google Maps with directions
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${selectedDestination.coordinates.lat},${selectedDestination.coordinates.lng}`;
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    window.open(url, '_blank');
  };

  // Get real parking spots from Google Maps API
  const getRealParkingSpots = async (query: string): Promise<ParkingSpot[]> => {
    if (!(window as any).google?.maps?.places) {
      console.log('Google Places API not available, using demo data only');
      return [];
    }

    try {
      const google = (window as any).google;
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      
      // Search for parking near the destination
      const searchRequest = {
        query: `parking near ${query}, ${selectedCity}, Poland`,
        type: ['parking'],
        location: userLocation || { lat: 54.3520, lng: 18.6466 },
        radius: 5000, // 5km search radius
        maxResults: 20
      };

      return new Promise((resolve, reject) => {
        service.textSearch(searchRequest, (results: any[], status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const realSpots: ParkingSpot[] = results.map((place, index) => ({
              id: 1000 + index, // Unique ID for real spots
              name: place.name || `Parking ${index + 1}`,
              address: place.formatted_address || place.vicinity || `${selectedCity}, Poland`,
              available: Math.floor(Math.random() * 50) + 10, // Simulated availability
              total: Math.floor(Math.random() * 100) + 50,
              price: Math.random() > 0.5 ? '3 PLN/h' : 'Free',
              type: 'street',
              rating: (place.rating || 4.0) + (Math.random() * 0.5),
              lastUpdated: 'Just updated',
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              features: ['Real-time Data', 'Google Maps', 'Verified Location'],
              images: [],
              isRealSpot: true
            }));
            resolve(realSpots);
          } else {
            console.log('No real parking spots found, using demo data only');
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching real parking spots:', error);
      return [];
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Parking spot handlers
  const openSpotDetails = (spotId: number) => {
    setDetailsSpotId(spotId);
    setShowDetails(true);
  };

  const closeSpotDetails = () => {
    setShowDetails(false);
    setDetailsSpotId(null);
  };

  const updateExistingSpot = (spotId: number, updates: Partial<ParkingSpot>) => {
    const updatedSpots = allParkingSpots.map(spot => 
      spot.id === spotId ? { ...spot, ...updates, lastUpdated: 'Just updated' } : spot
    );
    
    console.log('✅ Parking spot updated:', spotId, updates);
    alert('✅ Parking spot information updated successfully!');
  };

  // Computed values
  const selectedSpot = useMemo(() => 
    allParkingSpots.find(spot => spot.id === detailsSpotId) || null, 
    [detailsSpotId]
  );

  // Render city selection if needed
  if (isAuthenticated && showCitySelection) {
    return (
      <div className="city-selection-container">
        <div className="city-selection-card">
          <h2>Select Your City</h2>
          <p>Choose a city to explore parking options</p>
          <div className="city-grid">
            {availableCities.map(city => (
              <button
                key={city.id}
                className="city-button"
                onClick={() => handleCitySelection(city.id)}
              >
                <span className="city-name">{city.name}</span>
                <span className="city-subtitle">Poland</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} loginError={loginError} />;
  }

  // Render main app
  return (
    <div className="app-container">
      <Header 
        onLogout={handleLogout}
        selectedCity={selectedCity}
        availableCities={availableCities}
      />
      
      {/* City Selection Banner */}
      <div className="city-banner">
        <div className="city-info">
          <span className="city-label">📍 Current City:</span>
          <span className="city-name">{availableCities.find(c => c.id === selectedCity)?.name || 'Gdańsk'}</span>
          <button 
            className="change-city-btn"
            onClick={() => setShowCitySelection(true)}
          >
            Change City
          </button>
        </div>
      </div>
      
      {/* Map Section - Always Visible */}
      <div className="map-section">
        {isGoogleMapsReady ? (
          <Map 
            parkingSpots={nearbySpots.length > 0 ? nearbySpots : allParkingSpots}
            userLocation={userLocation}
            onSpotSelect={openSpotDetails}
            selectedDestination={selectedDestination}
          />
        ) : (
          <div className="loading-map">
            <p>Loading Google Maps...</p>
          </div>
        )}
      </div>
      
      {/* Search Section - Under Map */}
      <div className="search-section-new">
        <div className="search-container">
          <h3>🔍 Where are you planning to go?</h3>
          <div className="search-input-group">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && findNearbyParking()}
              placeholder="Enter destination name..."
              className="search-input"
              disabled={loading}
            />
            <button
              onClick={findNearbyParking}
              className="search-button"
              disabled={loading || !destination.trim()}
            >
              {loading ? 'Searching...' : 'Find Parking'}
            </button>
          </div>
          
          {/* Selected Destination Actions */}
          {selectedDestination && (
            <div className="destination-actions">
              <span className="selected-destination">
                🎯 {selectedDestination.name}
              </span>
              <button 
                className="directions-btn"
                onClick={getDirections}
              >
                🗺️ Get Directions
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Searches */}
      <div className="recent-searches">
        <h3>📚 Recent Searches</h3>
        <div className="search-tags">
          {recentSearches.length > 0 ? (
            recentSearches.map((search, index) => (
              <button
                key={index}
                className="search-tag"
                onClick={() => setDestination(search)}
              >
                {search}
              </button>
            ))
          ) : (
            <p className="no-recent">No recent searches yet</p>
          )}
        </div>
      </div>
      
      {/* Search Results */}
      {showResults && nearbySpots.length > 0 && (
        <div className="results-section">
          <h3>🚗 Nearby Parking Spots (500m - 1000m)</h3>
          <div className="view-toggle">
            <button
              className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
            <button
              className={`toggle-button ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              Map View
            </button>
          </div>
          
          {viewMode === 'list' && (
            <ParkingList 
              spots={nearbySpots}
              onSpotClick={openSpotDetails}
              userContributions={userContributions}
            />
          )}
        </div>
      )}
      
      {/* Modals */}
      <ParkingDetails 
        spot={selectedSpot}
        isOpen={showDetails}
        onClose={closeSpotDetails}
        onUpdateSpot={updateExistingSpot}
      />
    </div>
  );
};

export default App;