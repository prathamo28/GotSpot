import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  parkingSpots: Array<{
    id: number;
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    available: number;
    total: number;
    price: string;
    type: string;
    rating: number;
  }>;
  selectedSpot?: number | null;
  onSpotSelect?: (spotId: number) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const Map: React.FC<MapProps> = ({ 
  parkingSpots, 
  selectedSpot, 
  onSpotSelect,
  userLocation 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Cost optimization: Only load map when component mounts
  const initMap = useCallback(async () => {
    if (isMapLoaded || mapError) return;

    try {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
        version: 'weekly',
        libraries: ['places'],
        // Cost optimization: Load only essential features
        mapIds: ['DEMO_MAP_ID']
      });

      const google = await loader.load();
      
      if (mapRef.current) {
        // Center map on Gdansk
        const gdanskCenter = { lat: 54.3520, lng: 18.6466 };
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: gdanskCenter,
          zoom: 12,
          // Cost optimization: Use simplified map styles
          styles: [
            {
              featureType: 'poi.parking',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          // Cost optimization: Disable expensive features
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        setMap(mapInstance);
        setIsMapLoaded(true);
        
        // Add parking spot markers
        addParkingMarkers(mapInstance, google);
        
        // Add user location if available
        if (userLocation) {
          addUserLocationMarker(mapInstance, google, userLocation);
        }
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setMapError('Failed to load map. Please refresh the page.');
    }
  }, [isMapLoaded, mapError, userLocation]);

  // Cost optimization: Efficient marker management
  const addParkingMarkers = useCallback((mapInstance: google.maps.Map, google: any) => {
    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];

    parkingSpots.forEach(spot => {
      // Create optimized marker
      const marker = new google.maps.Marker({
        position: spot.coordinates,
        map: mapInstance,
        title: spot.name,
        icon: {
          url: getMarkerIcon(spot.type),
          scaledSize: new google.maps.Size(32, 32)
        },
        // Cost optimization: Reduce marker updates
        optimized: true
      });

      // Create info window with pilot project branding
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(spot),
        maxWidth: 300
      });

      // Add click listener
      marker.addListener('click', () => {
        // Close all other info windows first
        newInfoWindows.forEach(iw => iw.close());
        infoWindow.open(mapInstance, marker);
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
  }, [parkingSpots]);

  const addUserLocationMarker = useCallback((mapInstance: google.maps.Map, google: any, location: { lat: number; lng: number }) => {
    new google.maps.Marker({
      position: location,
      map: mapInstance,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#2563eb" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24)
      }
    });
  }, []);

  const createInfoWindowContent = (spot: any) => {
    return `
      <div style="padding: 15px; min-width: 250px; font-family: Arial, sans-serif;">
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 24px; margin-right: 10px;">${getSpotIcon(spot.type)}</span>
          <div>
            <h3 style="margin: 0; color: #2563eb; font-size: 16px;">${spot.name}</h3>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">${spot.address}</p>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #374151;">Available:</span>
            <span style="color: ${getAvailabilityColor(spot.available)}; font-weight: bold;">
              ${spot.available}/${spot.total} spots
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #374151;">Price:</span>
            <span style="color: #059669; font-weight: bold;">${spot.price}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #374151;">Rating:</span>
            <span style="color: #f59e0b;">⭐ ${spot.rating}</span>
          </div>
        </div>
        
        <div style="display: flex; gap: 8px;">
          <button 
            onclick="window.selectSpot(${spot.id})"
            style="
              background: #2563eb; 
              color: white; 
              border: none; 
              padding: 8px 16px; 
              border-radius: 6px; 
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              flex: 1;
            "
          >
            🗺️ View Details
          </button>
          <button 
            onclick="window.reserveSpot(${spot.id})"
            style="
              background: white; 
              color: #2563eb; 
              border: 1px solid #2563eb; 
              padding: 8px 16px; 
              border-radius: 6px; 
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              flex: 1;
            "
          >
            💳 Reserve Now
          </button>
        </div>
        
        <div style="margin-top: 10px; padding: 8px; background: #eff6ff; border-radius: 6px; text-align: center;">
          <span style="color: #1e40af; font-size: 12px;">🚀 Pilot Project - Real-time Data</span>
        </div>
      </div>
    `;
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

  const getMarkerIcon = (type: string) => {
    // Return a simple colored circle for markers
    const colors: { [key: string]: string } = {
      'mall': '#FF6B6B',
      'office': '#4ECDC4',
      'street': '#45B7D1',
      'university': '#96CEB4',
      'hospital': '#FFEAA7',
      'attraction': '#DDA0DD'
    };
    
    const color = colors[type] || '#FF6B6B';
    
    // Create SVG data URL for marker icon
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" font-size="16" fill="white" font-weight="bold">🅿️</text>
      </svg>
    `)}`;
  };

  const getAvailabilityColor = (available: number) => {
    if (available === 0) return '#dc2626';
    if (available < 5) return '#ca8a04';
    if (available < 20) return '#f59e0b';
    return '#16a34a';
  };

  // Cost optimization: Only load map when needed
  useEffect(() => {
    if (!isMapLoaded && !mapError) {
      initMap();
    }
  }, [initMap, isMapLoaded, mapError]);

  // Update markers when parking spots change
  useEffect(() => {
    if (map && isMapLoaded && markers.length > 0) {
      markers.forEach((marker, index) => {
        const spot = parkingSpots[index];
        if (spot) {
          marker.setPosition(spot.coordinates);
          marker.setTitle(spot.name);
        }
      });
    }
  }, [parkingSpots, map, isMapLoaded, markers]);

  // Highlight selected spot
  useEffect(() => {
    if (map && markers.length > 0 && selectedSpot !== null) {
      markers.forEach((marker, index) => {
        const spot = parkingSpots[index];
        if (spot && spot.id === selectedSpot) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          map.panTo(spot.coordinates);
          map.setZoom(16);
        } else {
          marker.setAnimation(null);
        }
      });
    }
  }, [selectedSpot, map, markers, parkingSpots]);

  // Expose functions globally for info window buttons
  useEffect(() => {
    (window as any).selectSpot = (spotId: number) => {
      if (onSpotSelect) {
        onSpotSelect(spotId);
      }
    };
    
    (window as any).reserveSpot = (spotId: number) => {
      if (onSpotSelect) {
        onSpotSelect(spotId);
      }
    };
  }, [onSpotSelect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Close all info windows to prevent memory leaks
      infoWindows.forEach(iw => iw.close());
    };
  }, [infoWindows]);

  if (mapError) {
    return (
      <div className="map-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Map Loading Error</h3>
          <p>{mapError}</p>
          <button onClick={() => {
            setMapError(null);
            setIsMapLoaded(false);
            initMap();
          }} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" style={{ width: '100%', height: '400px' }} />
      
      {/* Map Controls */}
      <div className="map-controls">
        <button 
          className="map-control-btn"
          onClick={() => map?.setZoom((map.getZoom() || 12) + 1)}
          title="Zoom In"
        >
          ➕
        </button>
        <button 
          className="map-control-btn"
          onClick={() => map?.setZoom((map.getZoom() || 12) - 1)}
          title="Zoom Out"
        >
          ➖
        </button>
        {userLocation && (
          <button 
            className="map-control-btn"
            onClick={() => map?.panTo(userLocation)}
            title="Center on my location"
          >
            📍
          </button>
        )}
        <button 
          className="map-control-btn"
          onClick={() => map?.panTo({ lat: 54.3520, lng: 18.6466 })}
          title="Center on Gdansk"
        >
          🏙️
        </button>
      </div>

      {/* Pilot Project Banner */}
      <div className="pilot-banner">
        <p>🚀 <strong>Pilot Project Active</strong> - Real-time parking data from Gdansk</p>
      </div>
    </div>
  );
};

export default Map;
