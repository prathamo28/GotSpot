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
              onSpotSelect={openSpotDetails}
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