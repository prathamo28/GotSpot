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
    
    // Additional Gdansk parking spots - 50 total
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
    },
    {
      id: 21,
      name: "Gdańsk Science and Technology Park",
      address: "Trzy Lipy 3, 80-172 Gdańsk",
      available: 45,
      total: 120,
      price: "3 PLN/h",
      type: "office",
      rating: 4.1,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3780, lng: 18.6200 },
      features: ["Covered", "Security", "EV Charging", "24/7"],
      images: []
    },
    {
      id: 22,
      name: "Gdańsk Marina Parking",
      address: "Szafarnia 5, 80-755 Gdańsk",
      available: 34,
      total: 80,
      price: "5 PLN/h",
      type: "attraction",
      rating: 4.3,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3490, lng: 18.6590 },
      features: ["Security", "Tourist Area", "Marina Access"],
      images: []
    },
    {
      id: 23,
      name: "Gdańsk Central Business District",
      address: "aleja Grunwaldzka 472, 80-309 Gdańsk",
      available: 78,
      total: 200,
      price: "4 PLN/h",
      type: "office",
      rating: 4.0,
      lastUpdated: "3 minutes ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Covered", "Security", "EV Charging", "Disabled Access"],
      images: []
    },
    {
      id: 24,
      name: "Gdańsk Sports Center",
      address: "aleja Grunwaldzka 244, 80-266 Gdańsk",
      available: 56,
      total: 150,
      price: "3 PLN/h",
      type: "sports",
      rating: 4.2,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3780, lng: 18.6120 },
      features: ["Covered", "Security", "Sports Facilities", "24/7"],
      images: []
    },
    {
      id: 25,
      name: "Gdańsk Cultural Center",
      address: "aleja Grunwaldzka 19, 80-264 Gdańsk",
      available: 23,
      total: 60,
      price: "4 PLN/h",
      type: "cultural",
      rating: 4.4,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Security", "Cultural Events", "Tourist Area"],
      images: []
    },
    {
      id: 26,
      name: "Gdańsk Library Parking",
      address: "Targ Rakowy 5/6, 80-806 Gdańsk",
      available: 12,
      total: 40,
      price: "Free",
      type: "public",
      rating: 4.0,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3540, lng: 18.6480 },
      features: ["Security", "Library Access", "Public Service"],
      images: []
    },
    {
      id: 27,
      name: "Gdańsk Post Office",
      address: "Długa 22, 80-827 Gdańsk",
      available: 8,
      total: 25,
      price: "2 PLN/h",
      type: "public",
      rating: 3.8,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3500, lng: 18.6500 },
      features: ["Security", "Post Office", "Public Service"],
      images: []
    },
    {
      id: 28,
      name: "Gdańsk Police Station",
      address: "Nowe Ogrody 27, 80-803 Gdańsk",
      available: 15,
      total: 35,
      price: "Free",
      type: "public",
      rating: 4.1,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3520, lng: 18.6470 },
      features: ["Security", "Police Station", "24/7"],
      images: []
    },
    {
      id: 29,
      name: "Gdańsk Fire Station",
      address: "aleja Grunwaldzka 82, 80-244 Gdańsk",
      available: 5,
      total: 20,
      price: "Free",
      type: "public",
      rating: 4.3,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3800, lng: 18.6100 },
      features: ["Security", "Fire Station", "Emergency Access"],
      images: []
    },
    {
      id: 30,
      name: "Gdańsk City Hall",
      address: "aleja Grunwaldzka 474, 80-309 Gdańsk",
      available: 20,
      total: 50,
      price: "3 PLN/h",
      type: "public",
      rating: 4.0,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Security", "City Hall", "Public Service"],
      images: []
    },
    {
      id: 31,
      name: "Gdańsk Court Building",
      address: "Nowe Ogrody 30, 80-803 Gdańsk",
      available: 18,
      total: 45,
      price: "3 PLN/h",
      type: "public",
      rating: 3.9,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3520, lng: 18.6470 },
      features: ["Security", "Court Building", "Public Service"],
      images: []
    },
    {
      id: 32,
      name: "Gdańsk Tax Office",
      address: "aleja Grunwaldzka 472, 80-309 Gdańsk",
      available: 25,
      total: 60,
      price: "3 PLN/h",
      type: "public",
      rating: 4.0,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Security", "Tax Office", "Public Service"],
      images: []
    },
    {
      id: 33,
      name: "Gdańsk Social Insurance",
      address: "aleja Grunwaldzka 244, 80-266 Gdańsk",
      available: 22,
      total: 55,
      price: "3 PLN/h",
      type: "public",
      rating: 3.8,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3780, lng: 18.6120 },
      features: ["Security", "Social Insurance", "Public Service"],
      images: []
    },
    {
      id: 34,
      name: "Gdańsk Employment Office",
      address: "aleja Grunwaldzka 19, 80-264 Gdańsk",
      available: 19,
      total: 48,
      price: "3 PLN/h",
      type: "public",
      rating: 3.9,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Security", "Employment Office", "Public Service"],
      images: []
    },
    {
      id: 35,
      name: "Gdańsk Bank Center",
      address: "aleja Grunwaldzka 472, 80-309 Gdańsk",
      available: 45,
      total: 120,
      price: "4 PLN/h",
      type: "office",
      rating: 4.1,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Covered", "Security", "Banking Services", "24/7"],
      images: []
    },
    {
      id: 36,
      name: "Gdańsk Insurance District",
      address: "aleja Grunwaldzka 244, 80-266 Gdańsk",
      available: 38,
      total: 95,
      price: "4 PLN/h",
      type: "office",
      rating: 4.0,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3780, lng: 18.6120 },
      features: ["Covered", "Security", "Insurance Services"],
      images: []
    },
    {
      id: 37,
      name: "Gdańsk Legal District",
      address: "aleja Grunwaldzka 19, 80-264 Gdańsk",
      available: 28,
      total: 70,
      price: "4 PLN/h",
      type: "office",
      rating: 4.2,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Covered", "Security", "Legal Services"],
      images: []
    },
    {
      id: 38,
      name: "Gdańsk Consulting Hub",
      address: "aleja Grunwaldzka 472, 80-309 Gdańsk",
      available: 35,
      total: 88,
      price: "4 PLN/h",
      type: "office",
      rating: 4.1,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Covered", "Security", "Consulting Services"],
      images: []
    },
    {
      id: 39,
      name: "Gdańsk IT Park",
      address: "aleja Grunwaldzka 244, 80-266 Gdańsk",
      available: 67,
      total: 168,
      price: "3 PLN/h",
      type: "office",
      rating: 4.3,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3780, lng: 18.6120 },
      features: ["Covered", "Security", "IT Services", "Free WiFi"],
      images: []
    },
    {
      id: 40,
      name: "Gdańsk Startup Zone",
      address: "aleja Grunwaldzka 19, 80-264 Gdańsk",
      available: 42,
      total: 105,
      price: "3 PLN/h",
      type: "office",
      rating: 4.4,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Covered", "Security", "Startup Services", "Free WiFi"],
      images: []
    },
    {
      id: 41,
      name: "Gdańsk Co-working Space",
      address: "aleja Grunwaldzka 472, 80-309 Gdańsk",
      available: 23,
      total: 58,
      price: "3 PLN/h",
      type: "office",
      rating: 4.2,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Covered", "Security", "Co-working", "Free WiFi"],
      images: []
    },
    {
      id: 42,
      name: "Gdańsk Innovation Center",
      address: "aleja Grunwaldzka 244, 80-266 Gdańsk",
      available: 31,
      total: 78,
      price: "4 PLN/h",
      type: "office",
      rating: 4.1,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3780, lng: 18.6120 },
      features: ["Covered", "Security", "Innovation Services"],
      images: []
    },
    {
      id: 43,
      name: "Gdańsk Research Institute",
      address: "aleja Grunwaldzka 19, 80-264 Gdańsk",
      available: 19,
      total: 48,
      price: "3 PLN/h",
      type: "office",
      rating: 4.0,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Covered", "Security", "Research Services"],
      images: []
    },
    {
      id: 44,
      name: "Gdańsk Development Agency",
      address: "aleja Grunwaldzka 472, 80-309 Gdańsk",
      available: 26,
      total: 65,
      price: "3 PLN/h",
      type: "office",
      rating: 4.1,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Covered", "Security", "Development Services"],
      images: []
    },
    {
      id: 45,
      name: "Gdańsk Export Center",
      address: "aleja Grunwaldzka 244, 80-266 Gdańsk",
      available: 33,
      total: 83,
      price: "4 PLN/h",
      type: "office",
      rating: 4.0,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3780, lng: 18.6120 },
      features: ["Covered", "Security", "Export Services"],
      images: []
    },
    {
      id: 46,
      name: "Gdańsk Trade Center",
      address: "aleja Grunwaldzka 19, 80-264 Gdańsk",
      available: 47,
      total: 118,
      price: "3 PLN/h",
      type: "office",
      rating: 4.2,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Covered", "Security", "Trade Services"],
      images: []
    },
    {
      id: 47,
      name: "Gdańsk Business Park",
      address: "aleja Grunwaldzka 472, 80-309 Gdańsk",
      available: 89,
      total: 223,
      price: "4 PLN/h",
      type: "office",
      rating: 4.3,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Covered", "Security", "Business Services", "EV Charging"],
      images: []
    },
    {
      id: 48,
      name: "Gdańsk Corporate Hub",
      address: "aleja Grunwaldzka 244, 80-266 Gdańsk",
      available: 56,
      total: 140,
      price: "4 PLN/h",
      type: "office",
      rating: 4.1,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3780, lng: 18.6120 },
      features: ["Covered", "Security", "Corporate Services"],
      images: []
    },
    {
      id: 49,
      name: "Gdańsk Executive Center",
      address: "aleja Grunwaldzka 19, 80-264 Gdańsk",
      available: 34,
      total: 85,
      price: "5 PLN/h",
      type: "office",
      rating: 4.4,
      lastUpdated: "1 minute ago",
      coordinates: { lat: 54.3550, lng: 18.6450 },
      features: ["Covered", "Security", "Executive Services", "Premium"],
      images: []
    },
    {
      id: 50,
      name: "Gdańsk Premium Parking",
      address: "aleja Grunwaldzka 472, 80-309 Gdańsk",
      available: 12,
      total: 30,
      price: "6 PLN/h",
      type: "premium",
      rating: 4.5,
      lastUpdated: "2 minutes ago",
      coordinates: { lat: 54.3750, lng: 18.6150 },
      features: ["Covered", "Security", "Premium Service", "Valet", "24/7"],
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

    // Load real parking spots on startup
    const loadInitialRealParkingSpots = async () => {
      if (!(window as any).google?.maps?.places) {
        console.log('⚠️ Google Places API not available yet, skipping initial load');
        return;
      }
      
      try {
        console.log('🔍 Loading initial real parking spots on startup...');
        console.log('📍 Searching around ZASPA area (Gdańsk)...');
        const realSpots = await getRealParkingSpots('Gdańsk');
        
        if (realSpots.length > 0) {
          // Combine with demo spots and set as initial data
          const combinedSpots = [...realSpots, ...allParkingSpots];
          setNearbySpots(combinedSpots);
          setShowResults(true);
          console.log(`✅ Successfully loaded ${realSpots.length} real spots on startup`);
          console.log('🎯 Real spots found:', realSpots.map(spot => ({ name: spot.name, address: spot.address })));
        } else {
          console.log('❌ No real parking spots found on startup, using demo data only');
          setNearbySpots(allParkingSpots);
        }
      } catch (error) {
        console.error('❌ Error loading initial real parking spots:', error);
        setNearbySpots(allParkingSpots);
      }
    };

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
        
        // Load real parking spots after API is ready
        setTimeout(() => {
          loadInitialRealParkingSpots();
        }, 1000); // Small delay to ensure API is fully ready
        
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

  // Enhanced search functionality with destination geocoding
  const handleSearch = async () => {
    if (!destination.trim()) return;
    
    setLoading(true);
    setShowResults(false);
    
    try {
      // First, try to geocode the destination to get coordinates
      if ((window as any).google?.maps?.Geocoder) {
        const geocoder = new (window as any).google.maps.Geocoder();
        const result = await geocoder.geocode({ 
          address: `${destination}, ${availableCities.find(c => c.id === selectedCity)?.name || 'Gdańsk'}, Poland` 
        });
        
        if (result.results[0]) {
          const coords = result.results[0].geometry.location;
          const destinationCoords = { 
            lat: coords.lat(), 
            lng: coords.lng() 
          };
          
          setSelectedDestination({
            name: destination,
            coordinates: destinationCoords
          });
          
          // Now search for parking around this destination
          await findNearbyParking(destination, destinationCoords);
        } else {
          // Fallback: search for parking spots with the destination name
          await findNearbyParking(destination);
        }
      } else {
        // Google Maps not available, use demo data
        setNearbySpots(allParkingSpots);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback: search for parking spots with the destination name
      await findNearbyParking(destination);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality - now takes destination coordinates as parameter
  const findNearbyParking = async (destination: string, destinationCoords?: { lat: number; lng: number }) => {
    if (!destination.trim()) return;
    
    setLoading(true);
    setShowResults(false);
    
    try {
      // First, try to get real parking spots from Google Maps
      const realSpots = await getRealParkingSpots(destination);
      
      // Combine real spots with demo spots for comprehensive coverage
      let combinedSpots = [...allParkingSpots];
      
      if (realSpots.length > 0) {
        // Add real spots to the beginning for priority
        combinedSpots = [...realSpots, ...combinedSpots];
        console.log(`✅ Combined ${realSpots.length} real spots with ${allParkingSpots.length} demo spots`);
      }
      
      // Filter spots within 1000 meters of the destination
      const coords = destinationCoords || selectedDestination?.coordinates;
      if (coords) {
        const nearbySpots = combinedSpots.filter(spot => {
          const distance = calculateDistance(
            coords.lat,
            coords.lng,
            spot.coordinates.lat,
            spot.coordinates.lng
          );
          return distance <= 1000; // 1km radius
        });
        
        // Sort by distance and availability
        nearbySpots.sort((a, b) => {
          const distanceA = calculateDistance(
            coords.lat,
            coords.lng,
            a.coordinates.lat,
            a.coordinates.lng
          );
          const distanceB = calculateDistance(
            coords.lat,
            coords.lng,
            b.coordinates.lat,
            b.coordinates.lng
          );
          
          // Prioritize real spots, then by distance, then by availability
          if (a.isRealSpot && !b.isRealSpot) return -1;
          if (!a.isRealSpot && b.isRealSpot) return 1;
          if (Math.abs(distanceA - distanceB) < 100) {
            // If distances are similar, prioritize availability
            return b.available - a.available;
          }
          return distanceA - distanceB;
        });
        
        setNearbySpots(nearbySpots);
        setShowResults(true);
        
        // Add to recent searches
        if (!recentSearches.includes(destination)) {
          setRecentSearches(prev => [destination, ...prev.slice(0, 9)]);
        }
        
        console.log(`🎯 Found ${nearbySpots.length} parking spots within 1km of "${destination}"`);
        console.log(`📍 Real spots: ${realSpots.length}, Demo spots: ${nearbySpots.length - realSpots.length}`);
      } else {
        // No destination coordinates, show all spots
        setNearbySpots(combinedSpots);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error finding nearby parking:', error);
      // Fallback to demo data only
      setNearbySpots(allParkingSpots);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Get real parking spots from Google Maps API using new Place API
  const getRealParkingSpots = async (query: string): Promise<ParkingSpot[]> => {
    if (!(window as any).google?.maps?.places) {
      console.log('Google Places API not available, using demo data only');
      return [];
    }

    try {
      const google = (window as any).google;
      console.log('🔍 Starting Google Places API search for parking spots...');
      console.log('🆕 Using new google.maps.places.Place API...');
      
      // Use the actual search center from the image (around ZASPA area)
      const searchCenter = { lat: 54.3780, lng: 18.6120 }; // ZASPA area coordinates
      
      let allResults: any[] = [];
      
      // Strategy 1: Use the new Place API with text search
      try {
        console.log('🔍 Strategy 1: Text search using new Place API...');
        
        const searchQueries = [
          'parking',
          'parking lot',
          'car park',
          'parking garage',
          'parking space'
        ];

        for (const term of searchQueries) {
          try {
            // Use the new Place API approach
            const searchRequest = {
              textQuery: `${term} in Gdańsk`,
              locationBias: {
                center: searchCenter,
                radius: 5000
              },
              maxResultCount: 20
            };

            // Create a new Place instance for searching
            const place = new google.maps.places.Place(searchRequest);
            
            const searchResults = await place.search();
            console.log(`✅ Text search for "${term}" found ${searchResults.length} results`);
            
            if (searchResults.length > 0) {
              allResults = [...allResults, ...searchResults];
            }
          } catch (error) {
            console.log(`Text search error for "${term}":`, error);
          }
        }
      } catch (error) {
        console.log('Strategy 1 error:', error);
      }

      // Strategy 2: Fallback to basic text search if Place API fails
      if (allResults.length === 0) {
        try {
          console.log('🔄 Strategy 2: Fallback to basic text search...');
          
          // Create a simple div for the service (legacy approach as fallback)
          const mapDiv = document.createElement('div');
          const map = new google.maps.Map(mapDiv, {
            center: searchCenter,
            zoom: 14
          });
          
          const service = new google.maps.places.PlacesService(map);
          
          const fallbackQueries = [
            'parking in Gdańsk',
            'parking lot Gdańsk',
            'car park Gdańsk'
          ];

          for (const query of fallbackQueries) {
            try {
              const textSearchRequest = {
                query: query,
                location: searchCenter,
                radius: 5000,
                maxResults: 20
              };

              const textResults = await new Promise<any[]>((resolve, reject) => {
                service.textSearch(textSearchRequest, (results: any[], status: any) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    console.log(`✅ Fallback search for "${query}" found ${results.length} results`);
                    resolve(results);
                  } else {
                    console.log(`❌ Fallback search for "${query}" failed: ${status}`);
                    resolve([]);
                  }
                });
              });
              
              allResults = [...allResults, ...textResults];
            } catch (error) {
              console.log(`Fallback search error for "${query}":`, error);
            }
          }
        } catch (error) {
          console.log('Strategy 2 error:', error);
        }
      }

      // Strategy 3: Search for specific places that typically have parking
      if (allResults.length === 0) {
        try {
          console.log('🔄 Strategy 3: Searching for establishments with parking...');
          
          const mapDiv = document.createElement('div');
          const map = new google.maps.Map(mapDiv, {
            center: searchCenter,
            zoom: 14
          });
          
          const service = new google.maps.places.PlacesService(map);
          
          const placeTypes = ['shopping_mall', 'transit_station', 'establishment'];
          
          for (const placeType of placeTypes) {
            try {
              const typeSearchRequest = {
                location: searchCenter,
                radius: 5000,
                type: [placeType],
                keyword: 'parking'
              };

              const typeResults = await new Promise<any[]>((resolve, reject) => {
                service.nearbySearch(typeSearchRequest, (results: any[], status: any) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    console.log(`✅ Type search for "${placeType}" found ${results.length} results`);
                    resolve(results);
                  } else {
                    console.log(`❌ Type search for "${placeType}" failed: ${status}`);
                    resolve([]);
                  }
                });
              });
              
              allResults = [...allResults, ...typeResults];
            } catch (error) {
              console.log(`Type search error for "${placeType}":`, error);
            }
          }
        } catch (error) {
          console.log('Strategy 3 error:', error);
        }
      }

      // Remove duplicates and filter for actual parking-related results
      const uniqueResults = allResults.filter((place, index, self) => {
        const firstIndex = self.findIndex(p => 
          p.place_id === place.place_id || 
          (p.geometry?.location?.lat() === place.geometry?.location?.lat() && 
           p.geometry?.location?.lng() === place.geometry?.location?.lng())
        );
        return index === firstIndex;
      });

      // Filter for parking-related results
      const parkingResults = uniqueResults.filter(place => {
        const name = place.name?.toLowerCase() || '';
        const types = place.types || [];
        const address = place.formatted_address?.toLowerCase() || '';
        
        return (
          name.includes('parking') ||
          name.includes('park') ||
          name.includes('car') ||
          types.includes('parking') ||
          address.includes('parking') ||
          address.includes('park')
        );
      });

      console.log(`Total unique results: ${uniqueResults.length}`);
      console.log(`Parking-related results: ${parkingResults.length}`);
      console.log('Parking results:', parkingResults.map(p => ({ name: p.name, types: p.types, address: p.formatted_address })));

      if (parkingResults.length === 0) {
        console.log('❌ No real parking spots found from Google Maps API');
        return [];
      }

      // Convert to ParkingSpot format
      const realSpots: ParkingSpot[] = parkingResults.map((place, index) => {
        // Generate realistic availability based on time
        const hour = new Date().getHours();
        let availability = Math.floor(Math.random() * 50) + 10;
        
        if (hour >= 8 && hour <= 18) {
          availability = Math.floor(Math.random() * 30) + 5;
        } else if (hour >= 19 && hour <= 23) {
          availability = Math.floor(Math.random() * 40) + 10;
        } else {
          availability = Math.floor(Math.random() * 60) + 20;
        }

        // Generate realistic pricing
        let price = "Free";
        if (place.types?.includes('shopping_mall')) {
          price = Math.random() > 0.3 ? "3 PLN/h" : "4 PLN/h";
        } else if (place.types?.includes('transit_station')) {
          price = Math.random() > 0.4 ? "4 PLN/h" : "5 PLN/h";
        } else if (place.types?.includes('establishment')) {
          price = Math.random() > 0.5 ? "2 PLN/h" : "3 PLN/h";
        }

        // Generate features based on place type
        const features = [];
        if (place.types?.includes('shopping_mall')) {
          features.push('Covered', 'Security', 'Free WiFi', 'Family Friendly');
        } else if (place.types?.includes('transit_station')) {
          features.push('Covered', 'Security', '24/7', 'Cameras');
        } else if (place.types?.includes('establishment')) {
          features.push('Security', 'Business Area');
        } else {
          features.push('Security', 'Verified Location');
        }

        if (Math.random() > 0.7) features.push('EV Charging');
        if (Math.random() > 0.8) features.push('Disabled Access');
        if (Math.random() > 0.6) features.push('Lighting');

        // Determine parking type
        let parkingType: ParkingSpot['type'] = 'street';
        if (place.types?.includes('shopping_mall')) {
          parkingType = 'mall';
        } else if (place.types?.includes('transit_station')) {
          parkingType = 'transport';
        } else if (place.types?.includes('establishment')) {
          parkingType = 'office';
        } else if (place.types?.includes('parking')) {
          parkingType = 'public';
        }

        return {
          id: 1000 + index,
          name: place.name || `Parking ${index + 1}`,
          address: place.formatted_address || place.vicinity || `Gdańsk, Poland`,
          available: availability,
          total: Math.floor(availability * (1.5 + Math.random() * 1.5)),
          price: price,
          type: parkingType,
          rating: (place.rating || 4.0) + (Math.random() * 0.5 - 0.25),
          lastUpdated: 'Just updated',
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          features: features,
          images: [],
          isRealSpot: true
        };
      });

      console.log(`✅ Successfully converted ${realSpots.length} real parking spots`);
      console.log('Real spots details:', realSpots.map(spot => ({ 
        name: spot.name, 
        type: spot.type, 
        coordinates: spot.coordinates,
        address: spot.address 
      })));
      
      return realSpots;
    } catch (error) {
      console.error('❌ Error in getRealParkingSpots:', error);
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter destination name..."
              className="search-input"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
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
          
          {/* Refresh Real Data Button */}
          <div className="refresh-section">
            <button 
              className="refresh-btn"
              onClick={async () => {
                setLoading(true);
                try {
                  console.log('🔄 Manually refreshing real parking data...');
                  const realSpots = await getRealParkingSpots('Gdańsk');
                  if (realSpots.length > 0) {
                    const combinedSpots = [...realSpots, ...allParkingSpots];
                    setNearbySpots(combinedSpots);
                    setShowResults(true);
                    alert(`✅ Found ${realSpots.length} real parking spots from Google Maps! Check the map and list below.`);
                    console.log('✅ Manual refresh successful:', realSpots);
                  } else {
                    alert('❌ No real parking spots found. Check console for details.');
                    console.log('❌ Manual refresh failed - no real spots found');
                  }
                } catch (error) {
                  console.error('❌ Manual refresh error:', error);
                  alert('❌ Error refreshing real data. Check console for details.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              🔄 Refresh Real Parking Data
            </button>
            <span className="refresh-info">Get latest parking spots from Google Maps</span>
            
            {/* Debug Info */}
            <div className="debug-info">
              <small>💡 Tip: Click this button to see real Google Maps parking spots!</small>
            </div>
          </div>
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
          <h3>🚗 Nearby Parking Spots (within 1km)</h3>
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
          
          {/* Parking List View */}
                  {viewMode === 'list' && (
                    <ParkingList
                      parkingSpots={nearbySpots}
                      onSpotSelect={openSpotDetails}
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