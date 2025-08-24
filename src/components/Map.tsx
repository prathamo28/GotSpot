// @ts-nocheck
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParkingSpot } from '../types/ParkingSpot';

interface MapProps {
  parkingSpots: ParkingSpot[];
  selectedSpot?: number | null;
  onSpotSelect?: (spotId: number) => void;
  userLocation?: { lat: number; lng: number } | null;
  selectedDestination?: { name: string; coordinates: { lat: number; lng: number } } | null;
}

const Map: React.FC<MapProps> = ({ parkingSpots, selectedSpot, onSpotSelect, userLocation, selectedDestination }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);
  const [isApiReady, setIsApiReady] = useState(false);

  // Check if Google Maps API is ready
  useEffect(() => {
    const checkApiReady = () => {
      if (window.google?.maps?.Map) {
        setIsApiReady(true);
      } else {
        // Check again in 100ms if not ready
        setTimeout(checkApiReady, 100);
      }
    };
    
    checkApiReady();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !isApiReady || !window.google?.maps) return;

    const defaultCenter = { lat: 54.3520, lng: 18.6466 }; // Gdansk center
    const center = userLocation || defaultCenter;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      });

      setMapInstance(map);
    } catch (error) {
      console.error('Error creating map:', error);
    }
  }, [isApiReady, userLocation]);

  // Update markers when parking spots change
  useEffect(() => {
    if (!mapInstance || !parkingSpots.length || !isApiReady) return;

    // Clear existing markers and info windows
    markers.forEach((marker: google.maps.Marker) => {
      // Remove marker from map by setting map to null
      (marker as any).setMap(null);
    });
    infoWindows.forEach((infoWindow: google.maps.InfoWindow) => infoWindow.close());
    
    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];

    // Add destination marker if selected
    if (selectedDestination) {
      try {
        const destinationMarker = new window.google.maps.Marker({
          map: mapInstance,
          position: selectedDestination.coordinates,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#1A202C" stroke="white" stroke-width="3"/>
                <text x="20" y="26" text-anchor="middle" font-size="16" fill="white" font-weight="bold">🎯</text>
              </svg>
            `)}`,
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 20, y: 20 }
          },
          title: `Destination: ${selectedDestination.name}`,
          optimized: true
        });
        
        // Create destination info window
        const destinationInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="
              padding: 16px;
              max-width: 280px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              <h3 style="
                margin: 0 0 8px 0;
                font-size: 18px;
                font-weight: 600;
                color: #1A202C;
              ">🎯 Destination</h3>
              <p style="
                margin: 0 0 12px 0;
                font-size: 16px;
                color: #1A202C;
                font-weight: 500;
              ">${selectedDestination.name}</p>
              <div style="
                background: #E0F2F7;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #1A202C;
                font-size: 14px;
                color: #1A202C;
              ">
                This is where you want to go. Look for parking spots nearby!
              </div>
            </div>
          `,
          maxWidth: 300
        });
        
        // Show destination info window by default
        destinationInfoWindow.open(mapInstance, destinationMarker);
        
        newMarkers.push(destinationMarker);
        newInfoWindows.push(destinationInfoWindow);
      } catch (error) {
        console.error('Error creating destination marker:', error);
      }
    }

    parkingSpots.forEach((spot: ParkingSpot, index: number) => {
      try {
        // Create marker icon
        const markerIcon = {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="${spot.available > 0 ? '#10b981' : '#ef4444'}" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" font-size="14" fill="white" font-weight="bold">P</text>
            </svg>
          `)}`,
          scaledSize: { width: 32, height: 32 },
          anchor: { x: 16, y: 16 }
        };

        // Create marker
        const marker = new window.google.maps.Marker({
          map: mapInstance,
          position: { lat: spot.coordinates.lat, lng: spot.coordinates.lng },
          icon: markerIcon,
          title: spot.name,
          optimized: true
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="
              padding: 16px;
              max-width: 280px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              <h3 style="
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 600;
                color: #1e293b;
              ">${spot.name}</h3>
              <p style="
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #64748b;
                line-height: 1.4;
              ">${spot.address}</p>
              <div style="
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
              ">
                <div style="
                  background: ${spot.available > 0 ? '#dcfce7' : '#fee2e2'};
                  color: ${spot.available > 0 ? '#166534' : '#991b1b'};
                  padding: 6px 12px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                  text-align: center;
                ">
                  ${spot.available} available
                </div>
                <div style="
                  background: #dbeafe;
                  color: #1e40af;
                  padding: 6px 12px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                  text-align: center;
                ">
                  ${spot.price}
                </div>
              </div>
              <div style="
                background: #f8fafc;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
              ">
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 8px;
                ">
                  <span style="color: #f59e0b;">★</span>
                  <span style="font-weight: 600; color: #1e293b;">${spot.rating}</span>
                  <span style="color: #64748b; font-size: 12px;">(${spot.type})</span>
                </div>
                <div style="
                  font-size: 12px;
                  color: #64748b;
                  font-style: italic;
                ">Updated: ${spot.lastUpdated}</div>
              </div>
            </div>
          `,
          maxWidth: 300
        });

        // Add click listener
        marker.addListener('click', () => {
          // Close all other info windows first
          newInfoWindows.forEach(iw => iw.close());
          infoWindow.open(mapInstance, marker);
          
          // Call onSpotSelect if provided
          if (onSpotSelect) {
            onSpotSelect(spot.id);
          }
        });

        newMarkers.push(marker);
        newInfoWindows.push(infoWindow);
      } catch (error) {
        console.error('Error creating parking spot marker:', error);
      }
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      try {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          const position = (marker as any).getPosition();
          if (position) {
            bounds.extend(position);
          }
        });
        
        // Set zoom to show all markers
        if (!bounds.isEmpty()) {
          mapInstance.fitBounds(bounds);
          mapInstance.setZoom(Math.min(mapInstance.getZoom() || 14, 16));
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  }, [mapInstance, parkingSpots, onSpotSelect, selectedDestination, isApiReady]);

  // Update map center when user location changes
  useEffect(() => {
    if (mapInstance && userLocation && isApiReady) {
      try {
        mapInstance.panTo(userLocation);
      } catch (error) {
        console.error('Error panning to user location:', error);
      }
    }
  }, [mapInstance, userLocation, isApiReady]);

  // Highlight selected spot
  useEffect(() => {
    if (!mapInstance || selectedSpot === null || !isApiReady) return;

    try {
      const selectedMarker = markers.find((_, index) => 
        parkingSpots[index]?.id === selectedSpot
      );

      if (selectedMarker) {
        // Pan to selected marker
        const position = (selectedMarker as any).getPosition();
        if (position) {
          mapInstance.panTo(position);
          mapInstance.setZoom(16);

          // Show info window for selected marker
          const selectedIndex = parkingSpots.findIndex((spot: ParkingSpot) => spot.id === selectedSpot);
          if (selectedIndex >= 0 && infoWindows[selectedIndex]) {
            infoWindows.forEach((iw: google.maps.InfoWindow) => iw.close());
            infoWindows[selectedIndex].open(mapInstance, selectedMarker);
          }
        }
      }
    } catch (error) {
      console.error('Error highlighting selected spot:', error);
    }
  }, [selectedSpot, mapInstance, markers, infoWindows, parkingSpots, isApiReady]);

  // Show loading state until API is ready
  if (!isApiReady || !window.google?.maps) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC', /* Light Grayish White for background */
        color: '#0F172A', /* Very Dark Gray/Navy for primary text */
        fontSize: '16px',
        fontWeight: '500'
      }}>
        Loading Google Maps...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '500px' }}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.12)' /* Very Dark Gray/Navy shadow */
        }} 
      />
      
      {/* Map Controls Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={() => {
            if (mapInstance && userLocation) {
              try {
                mapInstance.panTo(userLocation);
                mapInstance.setZoom(16);
              } catch (error) {
                console.error('Error going to user location:', error);
              }
            }
          }}
          style={{
            width: '40px',
            height: '40px',
            background: '#FFFFFF', /* White for card/secondary background */
            border: '1px solid #1E3A8A', /* Deep Navy Blue for borders */
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(30, 58, 138, 0.1)',
            fontSize: '18px'
          }}
          title="Go to my location"
        >
          📍
        </button>
        
        <button
          onClick={() => {
            if (mapInstance && parkingSpots.length > 0) {
              try {
                // Center map to show all markers
                mapInstance.setZoom(13);
                mapInstance.panTo({ lat: 54.3520, lng: 18.6466 });
              } catch (error) {
                console.error('Error showing all parking spots:', error);
              }
            }
          }}
          style={{
            width: '40px',
            height: '40px',
            background: '#FFFFFF', /* White for card/secondary background */
            border: '1px solid #1E3A8A', /* Deep Navy Blue for borders */
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(30, 58, 138, 0.1)',
            fontSize: '18px'
          }}
          title="Show all parking spots"
        >
          🎯
        </button>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: '#FFFFFF', /* White for card/secondary background */
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.1)',
        border: '1px solid #1E3A8A', /* Deep Navy Blue for borders */
        fontSize: '12px',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '8px', color: '#0F172A' }}>Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            background: '#10B981', /* Emerald Green for success */
            borderRadius: '50%',
            border: '2px solid #FFFFFF' /* White for card/secondary background */
          }}></div>
          <span style={{ color: '#0F172A' }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            background: '#EF4444', /* Red for full */
            borderRadius: '50%',
            border: '2px solid #FFFFFF' /* White for card/secondary background */
          }}></div>
          <span style={{ color: '#0F172A' }}>Full</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
