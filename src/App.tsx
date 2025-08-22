import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Loader } from '@googlemaps/js-api-loader';
import { ParkingSpot } from './types/ParkingSpot';

// Import new components
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import ParkingList from './components/ParkingList';
import ParkingDetails from './components/ParkingDetails';
import AddSpotModal from './components/AddSpotModal';
import Statistics from './components/Statistics';
import Map from './components/Map';

const App: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const DEMO_PASSWORD = 'gotspot2025';
  
  // App state
  const [destination, setDestination] = useState('');
  const [nearbySpots, setNearbySpots] = useState<ParkingSpot[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [detailsSpotId, setDetailsSpotId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [userContributions, setUserContributions] = useState<ParkingSpot[]>([]);

  // Demo parking spots data
  const allParkingSpots: ParkingSpot[] = [
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
    }
  ];

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
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('gotspot_demo_auth');
    setShowResults(false);
    setDestination('');
    setNearbySpots([]);
  };

  // Search functionality
  const findNearbyParking = async () => {
    if (!destination.trim()) return;
    
    setLoading(true);
    setShowResults(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, show all spots with simulated distances
      const spotsWithDistance = allParkingSpots.map(spot => ({
        ...spot,
        distance: Math.random() * 2 + 0.1 // Random distance 0.1-2.1 km
      }));
      
      setNearbySpots(spotsWithDistance);
    } catch (error) {
      console.error('Error finding parking:', error);
    } finally {
      setLoading(false);
    }
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

  const openAddSpotForm = () => {
    setShowAddSpot(true);
  };

  const closeAddSpotForm = () => {
    setShowAddSpot(false);
  };

  const addNewParkingSpot = (newSpot: Omit<ParkingSpot, 'id'>) => {
    const spotWithId: ParkingSpot = {
      ...newSpot,
      id: Date.now(),
      lastUpdated: 'Just added',
      isRealSpot: true
    };
    
    setUserContributions(prev => [...prev, spotWithId]);
    
    console.log('✅ New parking spot added:', spotWithId);
    alert(`🎉 Successfully added "${spotWithId.name}" to our database!`);
    
    closeAddSpotForm();
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

  const totalSpots = allParkingSpots.length + userContributions.length;
  const availableSpots = allParkingSpots.reduce((sum, spot) => sum + spot.available, 0) +
                        userContributions.reduce((sum, spot) => sum + spot.available, 0);
  const realSpots = allParkingSpots.filter(spot => spot.isRealSpot).length;
  const demoSpots = allParkingSpots.filter(spot => !spot.isRealSpot).length;

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} loginError={loginError} />;
  }

  // Render main app
  return (
    <div className="app-container">
      <Header 
        onAddSpot={openAddSpotForm}
        onLogout={handleLogout}
        totalSpots={totalSpots}
        availableSpots={availableSpots}
      />
      
      <SearchSection 
        destination={destination}
        onDestinationChange={setDestination}
        onSearch={findNearbyParking}
        loading={loading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      {showResults && (
        <>
          <Statistics 
            totalSpots={totalSpots}
            availableSpots={availableSpots}
            realSpots={realSpots}
            demoSpots={demoSpots}
            userContributions={userContributions.length}
          />
          
          {viewMode === 'list' ? (
            <ParkingList 
              spots={nearbySpots}
              onSpotClick={openSpotDetails}
              userContributions={userContributions}
            />
          ) : (
            <Map 
              parkingSpots={nearbySpots}
              userLocation={userLocation}
              onSpotClick={openSpotDetails}
            />
          )}
        </>
      )}
      
      {/* Modals */}
      <ParkingDetails 
        spot={selectedSpot}
        isOpen={showDetails}
        onClose={closeSpotDetails}
        onUpdateSpot={updateExistingSpot}
      />
      
      <AddSpotModal 
        isOpen={showAddSpot}
        onClose={closeAddSpotForm}
        onSubmit={addNewParkingSpot}
        userLocation={userLocation}
      />
    </div>
  );
};

export default App;